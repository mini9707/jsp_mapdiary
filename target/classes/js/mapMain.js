$(document).ready(function () {
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

    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: '/js/marker.png'
        })
    });

    // 위치정보 레이어 (WMS 마커 레이어)
    const wmsLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/new/wms',
            params: {
                'VERSION': '1.1.0',
                'LAYERS': 'new:locations',
                'TILED': true,
                'FORMAT': 'image/png',
                'TRANSPARENT': true
            },
            style: iconStyle,
            serverType: 'geoserver'
        })
    });

    map.addLayer(wmsLayer);

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
    map.addLayer(itsLyr);

    // 레이어 ON/OFF 이벤트
    $("#layer_btn").click(function () {
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
        $(this).text(isVisible ? "레이어 보이기" : "레이어 숨기기");
    });

    // 클릭 이벤트
    let clickedCoordinate = null;
    map.on('singleclick', function (evt) {
        const viewResolution = map.getView().getResolution();
        const wmsSource = wmsLayer.getSource();
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
                        // WMS 레이어의 포인트를 클릭한 경우
                        const feature = response.features[0];
                        const properties = feature.properties;

                        $('#info-title').text(properties.location_nm);
                        $('#info-description').text(properties.location_desc);

                        // 클릭한 위치에 팝업 표시
                        const pixel = evt.pixel;
                        const element = $('#info-popup');

                        element.css({
                            display: 'block',
                            left: (pixel[0] - element.width() / 2) + 'px',
                            top: (pixel[1] - element.height() - 20) + 'px'
                        });
                    } else {
                        // 빈 공간 클릭한 경우
                        clickedCoordinate = evt.coordinate;
                        $('#popup-form').css({
                            'display': 'flex'
                        });
                    }
                }
            });
        }
    });

    // 폼 제출 이벤트
    $('#locationForm').submit(function (e) {
        e.preventDefault();
        console.log("Form submitted");

        const coordinates = ol.proj.toLonLat(clickedCoordinate);
        const locationData = {
            locationNm: $('#locationNm').val(),
            locationDesc: $('#locationDesc').val(),
            locationX: coordinates[0],
            locationY: coordinates[1]
        };

        $.ajax({
            url: contextPath + "/map/insertLocation.do",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(locationData),
            success: function (response) {
                $('#locationForm')[0].reset();
                $('#popup-form').hide();

                // WMS 레이어 새로고침
                wmsLayer.getSource().updateParams({
                    'time': Date.now()
                });
            },
            error: function (error) {
                console.error("위치 저장 중 오류 발생:", error);
            }
        });
    });

    // 취소 버튼 이벤트
    $('#cancelBtn').click(function () {
        console.log("Cancel clicked");
        $('#locationForm')[0].reset();
        $('#popup-form').hide();
    });

    // 정보 팝업 닫기 버튼 이벤트
    $('#closeInfoBtn').click(function () {
        console.log("Close info clicked");
        $('#info-popup').hide();
    });

    // 팝업 외부 클릭 시 닫기
    $(document).on('click', function (e) {
        if ($(e.target).hasClass('popup-overlay')) {
            $('#popup-form').hide();
        }
    });

    // 지도 이동 완료 시 위치 목록 업데이트
    map.on('moveend', function () {
        if ($('#sidebar').hasClass('active')) {
            $('#menu_btn').trigger('click');  // 메뉴 버튼 클릭 이벤트 트리거
        }
    });

    // 사이드바 토글 기능
    $('#menu_btn').click(function () {
        $('#sidebar').toggleClass('active');

        // 현재 지도의 범위 가져오기
        const extent = map.getView().calculateExtent();
        const transformedExtent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

        // WFS 요청 파라미터
        const wfsUrl = 'http://localhost:8080/geoserver/new/ows';
        const wfsParams = {
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typeName: 'new:locations',
            outputFormat: 'application/json',
            maxFeatures: 1000,
            bbox: transformedExtent.join(',') + ',EPSG:4326'  // BBOX 파라미터 추가
        };

        console.log('WFS 요청 파라미터:', wfsParams);

        $.ajax({
            url: wfsUrl,
            data: wfsParams,
            dataType: 'json',
            success: function (response) {
                console.log('현재 영역 내 위치 정보:', response);

                if (response.features && response.features.length > 0) {
                    console.log('현재 영역 내 위치 개수:', response.features.length);

                    const locationsList = $('#locations-list');
                    locationsList.empty();

                    response.features.forEach(feature => {
                        const properties = feature.properties;
                        const coordinates = feature.geometry.coordinates;

                        const locationItem = $(`
                        <div class="location-item">
                            <h4>${properties.location_nm || '이름 없음'}</h4>
                            <p>${properties.location_desc || '설명 없음'}</p>
                            <p>좌표: ${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}</p>
                        </div>
                    `);

                        locationItem.click(function () {
                            const coords = ol.proj.fromLonLat(coordinates);
                            map.getView().animate({
                                center: coords,
                                zoom: 18,
                                duration: 1000
                            });
                        });

                        locationsList.append(locationItem);
                    });
                } else {
                    $('#locations-list').html('<p>현재 지도 영역에 저장된 위치가 없습니다.</p>');
                }
            },
            error: function (error) {
                console.error('WFS 요청 에러:', error);
                $('#locations-list').html('<p>위치 정보를 불러오는데 실패했습니다.</p>');
            }
        });
    });


    $('#close_sidebar').click(function () {
        $('#sidebar').removeClass('active');
    });
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
