$(document).ready(function () {
    const numericUserId = Number(userId);

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

    // 내 위치 Vector 레이어
    const vectorSource = new ol.source.Vector();
    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: contextPath + '/js/marker.png'
            })
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

    map.addLayer(vectorLayer);
    map.addLayer(itsLyr);

    // 레이어 토글 이벤트
    $("#traffic_layer_btn").click(() => {
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
    });

    // 위치 데이터 로드
    function loadLocations() {
        const extent = map.getView().calculateExtent();
        const transformedExtent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

        const wfsUrl = 'http://localhost:8080/geoserver/new/ows';
        const wfsParams = {
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typeName: 'new:locations',
            outputFormat: 'application/json',
            maxFeatures: 1000,
            CQL_FILTER: `user_id = ${numericUserId} AND bbox(geom, ${transformedExtent.join(',')})`
        };

        $.ajax({
            url: wfsUrl,
            data: wfsParams,
            dataType: 'json',
            success: function(response) {
                vectorSource.clear();
                if (response.features && response.features.length > 0) {
                    response.features.forEach(feature => {
                        const coords = ol.proj.fromLonLat(feature.geometry.coordinates);
                        const point = new ol.Feature({
                            geometry: new ol.geom.Point(coords),
                            properties: feature.properties
                        });
                        vectorSource.addFeature(point);
                    });
                    updateLocationsList(response.features);
                } else {
                    $('#locations-list').html('<p>현재 지도 영역에 저장된 위치가 없습니다.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('WFS 요청 에러:', error);
                $('#locations-list').html('<p>위치 정보를 불러오는데 실패했습니다.</p>');
            }
        });
    }

    // 위치 목록 업데이트
    function updateLocationsList(features) {
        const locationsList = $('#locations-list');
        locationsList.empty();

        features.forEach(feature => {
            const properties = feature.properties;
            const locationItem = $(`
                <div class="location-item">
                    <h4>${properties.location_nm || '이름 없음'}</h4>
                    <p>${properties.location_desc || '설명 없음'}</p>
                    <p>좌표: ${feature.geometry.coordinates[0].toFixed(6)}, ${feature.geometry.coordinates[1].toFixed(6)}</p>
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
    }

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

            $('#shareLocationCheckbox').prop('checked', properties.is_shared || false);
            $('#saveSharedLocationBtn').data('locationId', properties.location_id);
        } else {
            clickedCoordinate = evt.coordinate;
            $('#popup-form').css('display', 'flex');
        }
    });

    // 공유 장소 저장 버튼 이벤트
    $('#saveSharedLocationBtn').click(function() {
        const isShared = $('#shareLocationCheckbox').is(':checked');
        const locationId = $(this).data('locationId');

        if (isShared) {
            updateSharedStatus(locationId, true);
        } else {
            checkLikesAndConfirm(locationId);
        }
    });

    // 폼 제출 이벤트
    $('#locationForm').submit(function(e) {
        e.preventDefault();
        saveLocation();
    });

    // 기타 이벤트 핸들러들...
    $('#cancelBtn').click(() => {
        $('#locationForm')[0].reset();
        $('#popup-form').hide();
    });

    $('#closeInfoBtn').click(() => $('#info-popup').hide());

    $(document).on('click', function(e) {
        if ($(e.target).hasClass('popup-overlay')) {
            $('#popup-form').hide();
        }
    });

    // 지도 이동 완료 시 위치 목록 업데이트
    map.on('moveend', loadLocations);

    // 초기 데이터 로드
    loadLocations();
});