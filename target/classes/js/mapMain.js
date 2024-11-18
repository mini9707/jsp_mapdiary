$(document).ready(function() {
    // OpenLayers 지도 설정
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({ source: new ol.source.OSM() })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([126.9780, 37.5665]),
            zoom: 10
        })
    });

    const wmsLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/new/wms?service=WMS',
            params: {
                'VERSION' : '1.1.0',
                'LAYERS': 'new:locations',
                'SRS' : 'EPSG:4326'
            },
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
    $("#layer_btn").click(function() {
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
        $(this).text(isVisible ? "레이어 보이기" : "레이어 숨기기");
    });

    // 벡터 레이어 설정
    const vectorSource = new ol.source.Vector();
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
    map.addLayer(vectorLayer);

    // 클릭 이벤트
    let clickedCoordinate = null;
    map.on('click', function(event) {
        console.log("Map clicked");

        const featureAtPixel = map.forEachFeatureAtPixel(event.pixel, function(feature) {
            return feature;
        });

        if (!featureAtPixel) {
            console.log("Empty space clicked");
            clickedCoordinate = event.coordinate;
            $('#popup-form').css({
                'display': 'flex'
            });
        } else {
            console.log("Feature clicked");
            const name = featureAtPixel.get('name');
            const description = featureAtPixel.get('description');

            if (name) {
                $('#info-title').text(name);
                $('#info-description').text(description);

                // 클릭한 위치에 팝업 표시
                const pixel = event.pixel;
                const element = $('#info-popup');

                element.css({
                    display: 'block',
                    left: (pixel[0] - element.width() / 2) + 'px',
                    top: (pixel[1] - element.height() - 20) + 'px'  // 화살표 공간 확보
                });
            }
        }
    });

    // 폼 제출 이벤트
    $('#locationForm').submit(function(e) {
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
            success: function(response) {
                const pointFeature = new ol.Feature({
                    geometry: new ol.geom.Point(clickedCoordinate),
                    name: response.locationNm,
                    description: response.locationDesc
                });
                vectorSource.addFeature(pointFeature);

                $('#locationForm')[0].reset();
                $('#popup-form').hide();
            },
            error: function(error) {
                console.error("위치 저장 중 오류 발생:", error);
            }
        });
    });

    // 취소 버튼 이벤트
    $('#cancelBtn').click(function() {
        console.log("Cancel clicked");
        $('#locationForm')[0].reset();
        $('#popup-form').hide();
    });

    // 정보 팝업 닫기 버튼 이벤트
    $('#closeInfoBtn').click(function() {
        console.log("Close info clicked");
        $('#info-popup').hide();
    });

    // 팝업 외부 클릭 시 닫기
    $(document).on('click', function(e) {
        if ($(e.target).hasClass('popup-overlay')) {
            $('#popup-form').hide();
        }
    });

    // 위치 데이터 로드
    // function loadLocations() {
    //     $.ajax({
    //         url: contextPath + "/map/selectLocationList.do",
    //         type: "GET",
    //         success: function(locations) {
    //             locations.forEach(location => {
    //                 const coord = ol.proj.fromLonLat([location.locationX, location.locationY]);
    //                 const pointFeature = new ol.Feature({
    //                     geometry: new ol.geom.Point(coord),
    //                     name: location.locationNm,
    //                     description: location.locationDesc
    //                 });
    //                 vectorSource.addFeature(pointFeature);
    //             });
    //         },
    //         error: function(error) {
    //             console.error("위치 목록 로딩 중 오류 발생:", error);
    //         }
    //     });
    // }
    // loadLocations();
});