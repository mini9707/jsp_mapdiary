$(document).ready(function () {

    if (username) {
        // 로그인 상태일 경우
        $('#username').text(username + '님').show(); // 사용자 이름 표시
        $('#logout_btn').show(); // 로그아웃 버튼 표시
        $('#login_btn').hide(); // 로그인 버튼 숨기기
        $('#signup_btn').hide(); // 회원가입 버튼 숨기기
    } else {
        // 로그인하지 않은 상태일 경우
        $('#login_btn').show(); // 로그인 버튼 표시
        $('#signup_btn').show(); // 회원가입 버튼 표시
        $('#logout_btn').hide(); // 로그아웃 버튼 숨기기
        $('#username').hide(); // 사용자 이름 숨기기
    }

    // 로그아웃 버튼 클릭 이벤트
    $('#logout_btn').on('click', function() {
        // 로그아웃 요청을 서버에 보냄
        $.ajax({
            url: contextPath + "/logout.do", // 로그아웃 URL
            type: "POST",
            success: function(response) {
                // 로그아웃 성공 시 페이지 새로고침
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error('로그아웃 실패:', error);
                console.error('서버 응답:', xhr.responseText); // 서버 응답 출력
                alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    });

// OpenLayers 지도 설정
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({source: new ol.source.OSM()})
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([126.9780, 37.5665]),
            zoom: 10
        })
    });

    // 교통정보 레이어
    var itsLyr = new ol.layer.Tile({
        name: 'itsLyr',
        source: new ol.source.TileWMS({
            projection: 'EPSG:3857',
            url: 'https://its.go.kr:9443/geoserver/ntic/wms',
            crossOrigin: 'anonymous',
            params: {
                'SERVICE': 'WMS',
                'VERSION': '1.3.0',
                'REQUEST': 'GetMap',
                'TILED': true,
                'TRANSPARENT': true,
                'CRS': 'EPSG:3857',
                'SRS': 'EPSG:5187',
                'WIDTH': 256,
                'HEIGHT': 256,
                'FORMAT': 'image/png8',
                'LAYERS': 'ntic:N_LEVEL_15',
                'STYLES': 'REALTIME',
                'PALETTE': 'safe'
            },
            serverType: 'geoserver'
        })
    });

    // Hot 위치 WMS 레이어
    const hotWmsLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/new/wms',
            params: {
                'VERSION': '1.1.0',
                'LAYERS': 'new:locations',
                'TILED': true,
                'FORMAT': 'image/png',
                'TRANSPARENT': true
            },
            serverType: 'geoserver'
        })
    });

    map.addLayer(hotWmsLayer);
    map.addLayer(itsLyr);

    // 레이어 ON/OFF 이벤트
    $("#traffic_layer_btn").click(function () {
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
    });

    function getHotLocationIds() {
        $.ajax({
            url: contextPath + '/getHotLocationIds.do',
            type: 'GET',
            success: function(locationIds) {
                console.log('받아온 location IDs:', locationIds);
                if (locationIds && locationIds.length > 0) {
                    const cqlFilter = `location_id IN (${locationIds.join(',')})`;
                    console.log('적용할 CQL_FILTER:', cqlFilter);
                    hotWmsLayer.getSource().updateParams({
                        'CQL_FILTER': cqlFilter,
                        'TIMESTAMP': new Date().getTime()
                    });
                }
            }
        });
    }

    function loadHotLocations() {
        $.ajax({
            url: contextPath + '/getHotLocations.do',
            type: 'GET',
            success: function(locations) {
                if (locations && locations.length > 0) {
                    const locationsList = $('#locations-list');
                    locationsList.empty();

                    locations.forEach(location => {
                        const locationItem = $(`
                        <div class="location-item">
                            <h4>${location.location_nm || '이름 없음'}</h4>
                            <p>${location.location_desc || '설명 없음'}</p>
                            <p>작성자: ${location.username}</p>
                            <p>좋아요: ${location.like_count}개</p>
                        </div>
                    `);

                        // 클릭 이벤트 수정
                        locationItem.click(function() {
                            console.log('위치 클릭됨:', location);  // 디버깅용
                            console.log('좌표:', location.location_x, location.location_y);  // 디버깅용

                            // 숫자로 변환
                            const x = parseFloat(location.location_x);
                            const y = parseFloat(location.location_y);

                            if (!isNaN(x) && !isNaN(y)) {
                                const coords = ol.proj.fromLonLat([x, y]);
                                console.log('변환된 좌표:', coords);  // 디버깅용

                                map.getView().animate({
                                    center: coords,
                                    zoom: 18,
                                    duration: 1000
                                });
                            } else {
                                console.error('잘못된 좌표:', location.location_x, location.location_y);
                            }
                        });

                        locationsList.append(locationItem);
                    });
                } else {
                    $('#locations-list').html('<p>현재 지도 영역에 인기 위치가 없습니다.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('위치 정보 로드 실패:', error);
                $('#locations-list').html('<p>위치 정보를 불러오는데 실패했습니다.</p>');
            }
        });
    }

    // Hot 버튼 클릭 이벤트
    $("#hot_btn").click(function() {
        const isVisible = hotWmsLayer.getVisible();
        hotWmsLayer.setVisible(!isVisible);
        if (!isVisible) {
            getHotLocationIds();
            loadHotLocations();
        }
    });

    // 클릭 이벤트 (지도 위 위치 클릭 시 정보 표시)
    map.on('singleclick', function (evt) {
        const viewResolution = map.getView().getResolution();
        const wmsSource = hotWmsLayer.getSource();
        const url = wmsSource.getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            'EPSG:3857',
            {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 1}
        );

        if (url) {
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (response) {
                    if (response.features && response.features.length > 0) {
                        const feature = response.features[0];
                        const properties = feature.properties;

                        // 정보 팝업 표시
                        $('#info-title').text(properties.location_nm);
                        $('#info-description').text(properties.location_desc);

                        const pixel = evt.pixel;
                        const element = $('#info-popup');
                        element.css({
                            display: 'block',
                            left: (pixel[0] - element.width() / 2) + 'px',
                            top: (pixel[1] - element.height() - 20) + 'px'
                        });
                    }
                }
            });
        }
    });

// 정보 팝업 닫기 버튼 이벤트
    $('#closeInfoBtn').click(function () {
        $('#info-popup').hide();
    });

    // 초기 로드
    getHotLocationIds();
    loadHotLocations();
});

//벡터 레이어 설정 (Geoserver 레이어 사용 전)
/*const vectorSource = new ol.source.Vector();
const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({ color: 'black', width: 1 })
        })
    })
});
map.addLayer(vectorLayer);*/

//위치 데이터 로드 (Geoserver 레이어 사용 전 - DB에서 데이터 요청)
/*
function loadLocations() {
    $.ajax({
        url: contextPath + "/map/selectLocationList.do",
        type: "GET",
        success: function(locations) {
            locations.forEach(location => {
                const coord = ol.proj.fromLonLat([location.locationX, location.locationY]);
                const pointFeature = new ol.Feature({
                    geometry: new ol.geom.Point(coord),
                    name: location.locationNm,
                    description: location.locationDesc
                });
                vectorSource.addFeature(pointFeature);
            });
        },
        error: function(error) {
            console.error("위치 목록 로딩 중 오류 발생:", error);
        }
    });
}
loadLocations();
*/
