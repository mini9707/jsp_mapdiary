$(document).ready(function () {
    const numericUserId = Number(userId);

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

    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: '/js/marker.png'
        })
    });

    // 자신이 메모한 위치정보 레이어
    const wmsLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/new/wms',
            params: {
                'VERSION': '1.1.0',
                'LAYERS': 'new:locations',
                'TILED': true,
                'FORMAT': 'image/png',
                'TRANSPARENT': true,
                'CQL_FILTER': `user_id = ${numericUserId}` // 유저 ID로 필터링
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
    $("#traffic_layer_btn").click(function () {
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
        $(this).text(isVisible ? "레이어 보이기" : "레이어 숨기기");
    });

    // 클릭 이벤트
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

                        // properties 객체 출력
                        console.log("Properties:", properties); // properties 객체 확인

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

                        // 공유 체크박스 초기화
                        $('#shareLocationCheckbox').prop('checked', false); // 초기화

                        // locationId 저장
                        $('#saveSharedLocationBtn').data('locationId', properties.location_id); // location_id를 data 속성에 저장

                        // is_shared 상태에 따라 체크박스 설정
                        if (properties.is_shared) {
                            $('#shareLocationCheckbox').prop('checked', true); // 체크박스 체크
                        } else {
                            $('#shareLocationCheckbox').prop('checked', false); // 체크박스 해제
                        }
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

// 공유 장소 저장 버튼 클릭 이벤트
    $('#saveSharedLocationBtn').click(function () {
        const isShared = $('#shareLocationCheckbox').is(':checked');
        const locationId = $(this).data('locationId'); // data 속성에서 locationId 가져오기

        const sharedLocationData = {
            locationId: locationId, // 가져온 locationId 사용
            sharedUserId: numericUserId, // 현재 사용자 ID
        };

        if (isShared) {
            // 1. Locations 테이블의 is_shared 필드 업데이트
            $.ajax({
                url: contextPath + "/updateLocationSharedStatus.do", // Locations 업데이트 URL
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ locationId: locationId, isShared: true }),
                success: function (updateResponse) {
                    // 2. Shared_Locations 테이블에 추가
                    $.ajax({
                        url: contextPath + "/saveSharedLocation.do", // 서버의 저장 URL
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(sharedLocationData),
                        success: function (response) {
                            alert('장소가 공유되었습니다.');
                            $('#info-popup').hide(); // 팝업 닫기
                        },
                        error: function (xhr, status, error) {
                            const errorMessage = xhr.responseText || '장소 공유에 실패했습니다.';
                            console.error("장소 공유 중 오류 발생:", error);
                            alert(errorMessage); // 사용자에게 오류 메시지 표시
                        }
                    });
                },
                error: function (xhr, status, error) {
                    const errorMessage = xhr.responseText || '장소 공유 상태 업데이트에 실패했습니다.';
                    console.error("장소 공유 상태 업데이트 중 오류 발생:", error);
                    alert(errorMessage); // 사용자에게 오류 메시지 표시
                }
            });
        } else {
            // 체크박스가 해제된 경우, Shared_Locations 테이블에서 삭제
            $.ajax({
                url: contextPath + "/deleteSharedLocation.do", // 삭제 요청 URL
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ locationId: locationId, sharedUserId: numericUserId }), // 필요한 데이터 전송
                success: function (deleteResponse) {
                    // 2. Locations 테이블의 is_shared 필드 업데이트
                    $.ajax({
                        url: contextPath + "/updateLocationSharedStatus.do", // Locations 업데이트 URL
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({ locationId: locationId, isShared: false }),
                        success: function (updateResponse) {
                            alert('공유가 취소되었습니다.');
                            $('#info-popup').hide(); // 팝업 닫기
                        },
                        error: function (xhr, status, error) {
                            const errorMessage = xhr.responseText || '공유 취소에 실패했습니다.';
                            console.error("공유 취소 중 오류 발생:", error);
                            alert(errorMessage); // 사용자에게 오류 메시지 표시
                        }
                    });
                },
                error: function (xhr, status, error) {
                    const errorMessage = xhr.responseText || '공유 취소에 실패했습니다.';
                    console.error("공유 취소 중 오류 발생:", error);
                    alert(errorMessage); // 사용자에게 오류 메시지 표시
                }
            });
        }
    });

    // 폼 제출 이벤트
    $('#locationForm').submit(function (e) {
        e.preventDefault();

        const coordinates = ol.proj.toLonLat(clickedCoordinate);
        const locationData = {
            locationNm: $('#locationNm').val(),
            locationDesc: $('#locationDesc').val(),
            locationX: coordinates[0],
            locationY: coordinates[1],
            userId: userId // userId 추가
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
        $('#locationForm')[0].reset();
        $('#popup-form').hide();
    });

    // 정보 팝업 닫기 버튼 이벤트
    $('#closeInfoBtn').click(function () {
        $('#info-popup').hide();
    });

    // 팝업 외부 클릭 시 닫기
    $(document).on('click', function (e) {
        if ($(e.target).hasClass('popup-overlay')) {
            $('#popup-form').hide();
        }
    });

    // 사이드바 항상 보이게 설정
    $('#sidebar').css('display', 'block');

    // 지도 이동 완료 시 위치 목록 업데이트
    map.on('moveend', function () {
        loadLocations(); // 지도 이동 시 위치 목록을 로드하는 함수 호출
    });

    // 위치 목록 로드 함수
    function loadLocations() {
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
            CQL_FILTER: `user_id = ${numericUserId} AND bbox(geom, ${transformedExtent[0]}, ${transformedExtent[1]}, ${transformedExtent[2]}, ${transformedExtent[3]})`
        };

        $.ajax({
            url: wfsUrl,
            data: wfsParams,
            dataType: 'json',
            success: function (response) {
                if (response.features && response.features.length > 0) {
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
            error: function (xhr, status, error) {
                console.error('WFS 요청 에러:', error);
                console.error('상태 코드:', xhr.status);
                console.error('서버 응답:', xhr.responseText);
                $('#locations-list').html('<p>위치 정보를 불러오는데 실패했습니다.</p>');
            }
        });
    }

    // 페이지 로드 시 위치 목록 로드
    loadLocations();

});