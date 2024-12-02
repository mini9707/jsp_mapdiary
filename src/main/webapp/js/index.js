$(document).ready(function () {
    // 로그인 상태 관리
    if (username) {
        $('#username').text(username + '님').show();
        $('#logout_btn').show();
        $('#login_btn, #signup_btn').hide();
    } else {
        $('#login_btn, #signup_btn').show();
        $('#logout_btn, #username').hide();
    }

    // 로그아웃 이벤트
    $('#logout_btn').on('click', function() {
        $.ajax({
            url: contextPath + "/logout.do",
            type: "POST",
            success: function() { location.reload(); },
            error: function(xhr, status, error) {
                console.error('로그아웃 실패:', error);
                alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    });

    // 지도 초기화
    const map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
        view: new ol.View({
            center: ol.proj.fromLonLat([126.9780, 37.5665]),
            zoom: 10
        })
    });

    // 교통정보 레이어
    const itsLyr = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'https://its.go.kr:9443/geoserver/ntic/wms',
            params: {
                'VERSION': '1.3.0',
                'LAYERS': 'ntic:N_LEVEL_15',
                'STYLES': 'REALTIME',
                'FORMAT': 'image/png8',
                'TRANSPARENT': true
            },
            serverType: 'geoserver'
        })
    });

    // Hot 위치 Vector 레이어
    const hotVectorSource = new ol.source.Vector();
    const hotVectorLayer = new ol.layer.Vector({
        source: hotVectorSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: contextPath + '/js/marker.png'
            })
        })
    });

    map.addLayer(hotVectorLayer);
    map.addLayer(itsLyr);

    // 레이어 토글 이벤트
    $("#traffic_layer_btn").click(() => {
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
    });

    function updateHotLocations() {
        $.ajax({
            url: contextPath + '/getHotLocations.do',
            type: 'GET',
            success: function(locations) {
                hotVectorSource.clear();
                if (locations && locations.length > 0) {
                    locations.forEach(location => {
                        const coords = ol.proj.fromLonLat([location.location_x, location.location_y]);
                        const point = new ol.Feature({
                            geometry: new ol.geom.Point(coords),
                            properties: {
                                location_nm: location.location_nm,
                                location_desc: location.location_desc,
                                username: location.username,
                                like_count: location.like_count  // 여기를 like_count로 사용
                            }
                        });
                        hotVectorSource.addFeature(point);
                    });
                    updateSidebar(locations.map(location => ({
                        geometry: {
                            coordinates: [location.location_x, location.location_y]
                        },
                        properties: {
                            location_nm: location.location_nm,
                            location_desc: location.location_desc,
                            username: location.username,
                            like_count: location.like_count
                        }
                    })));
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching hot locations:', error);
            }
        });
    }

    function updateSidebar(features) {
        const locationsList = $('#locations-list');
        locationsList.empty();

        if (features && features.length > 0) {
            features.forEach(feature => {
                const properties = feature.properties;
                const locationItem = $(`
                    <div class="location-item">
                        <h4>${properties.location_nm || '이름 없음'}</h4>
                        <p>${properties.location_desc || '설명 없음'}</p>
                        <p>작성자: ${properties.username}</p>
                        <p>좋아요: ${properties.like_count}개</p>
                    </div>
                `);

                locationItem.click(function() {
                    const coords = ol.proj.fromLonLat(feature.geometry.coordinates);
                    map.getView().animate({
                        center: coords,
                        zoom: 18,
                        duration: 1000
                    });
                });

                locationsList.append(locationItem);
            });
        } else {
            locationsList.html('<p>인기 위치가 없습니다.</p>');
        }
    }

    // Hot 버튼 클릭 이벤트
    $("#hot_btn").click(() => {
        const isVisible = hotVectorLayer.getVisible();
        hotVectorLayer.setVisible(!isVisible);
        if (!isVisible) {
            updateHotLocations();
        }
    });

    // 위치 클릭 이벤트
    map.on('singleclick', function(evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });

        if (feature) {
            const properties = feature.get('properties');
            $('#info-title').text(properties.location_nm);
            $('#info-description').text(properties.location_desc);

            const element = $('#info-popup');
            element.css({
                display: 'block',
                left: (evt.pixel[0] - element.width() / 2) + 'px',
                top: (evt.pixel[1] - element.height() - 20) + 'px'
            });
        }
    });

    $('#closeInfoBtn').click(() => $('#info-popup').hide());

    // 초기 데이터 로드
    updateHotLocations();
});