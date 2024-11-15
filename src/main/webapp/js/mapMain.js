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

    // // 교통정보 API WMS 레이어
    // const trafficWmsLayer = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'https://its.go.kr:9443/geoserver/gwc/service/wmts/rest/ntic:N_LEVEL_{z}/ntic:REALTIME/EPSG:3857/EPSG:3857:{z}/{y}/{x}?format=image/png8&apiKey=a1a330fa448e491c99ca91525f44561a',
    //         params: {
    //             'LAYERS': 'ntic:REALTIME',
    //             'SRS': 'EPSG:3857'
    //         },
    //         serverType: 'geoserver',
    //         tileGrid: ol.tilegrid.createXYZ({
    //             maxZoom: 19
    //         })
    //     })
    // });

    // GeoServer WMS 레이어
    const wmsLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/new/wms?service=WMS',
            params: {
                'VERSION' : '1.1.0',
                'LAYERS': 'new:GG',
                'SRS' : 'EPSG:5179'
            },
            serverType: 'geoserver'
        })
    });
    map.addLayer(wmsLayer);
    //map.addLayer(trafficWmsLayer);

    // 레이어 버튼 이벤트
    const layerButton = document.getElementById("layer_btn");
    layerButton.addEventListener("click", function() {
        const isVisible = wmsLayer.getVisible();
        wmsLayer.setVisible(!isVisible);
        this.textContent = isVisible ? "레이어 보이기" : "레이어 숨기기";
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
    map.on('click', function(event) {
        const featureAtPixel = map.forEachFeatureAtPixel(event.pixel, function(feature) {
            return feature;
        });

        if (!featureAtPixel) {
            const coordinates = ol.proj.toLonLat(event.coordinate);
            const name = prompt("위치의 이름을 입력하세요:");
            if (name) {
                $.ajax({
                    url: contextPath + "/map/insertLocation.do",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        locationNm: name,
                        locationX: coordinates[0],
                        locationY: coordinates[1]
                    }),
                    success: function(response) {
                        const pointFeature = new ol.Feature({
                            geometry: new ol.geom.Point(event.coordinate),
                            name: response.locationNm
                        });
                        vectorSource.addFeature(pointFeature);
                    },
                    error: function(error) {
                        console.error("위치 저장 중 오류 발생:", error);
                    }
                });
            }
        }
    });

    // 위치 데이터 로드
    function loadLocations() {
        $.ajax({
            url: contextPath + "/map/selectLocationList.do",
            type: "GET",
            success: function(locations) {
                locations.forEach(location => {
                    const coord = ol.proj.fromLonLat([location.locationX, location.locationY]);
                    const pointFeature = new ol.Feature({
                        geometry: new ol.geom.Point(coord),
                        name: location.locationNm
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

    // 포인트 클릭 이벤트
    map.on('singleclick', function(event) {
        map.forEachFeatureAtPixel(event.pixel, function(feature) {
            const name = feature.get('name');
            if (name) {
                alert("Name: " + name);
            }
        });
    });
});