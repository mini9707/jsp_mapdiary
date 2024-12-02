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
            center: ol.proj.fromLonLat([126.7052, 37.4563]),
            zoom: 11
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
        }),
        visible: false
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
    $('#hot_layer_toggle').change(function() {
        hotVectorLayer.setVisible($(this).is(':checked'));
    });

    // 탭 전환 이벤트
    $('.layer-tab').click(function() {
        const tabId = $(this).data('tab');

        $('.layer-tab').removeClass('active');
        $(this).addClass('active');

        $('.layer-content').removeClass('active');
        $(`#${tabId}-content`).addClass('active');

        if (tabId === 'hot') {
            updateHotLocations();
        } else if (tabId === 'shared') {
            updateSharedLocations();  // 공유 레이어 탭 클릭시 호출
        }
    });

    // 인기 장소 업데이트 함수
    function updateHotLocations() {
        $.ajax({
            url: contextPath + '/getHotLocations.do',
            type: 'GET',
            success: function(locations) {
                if (locations && locations.length > 0) {
                    updateSidebar(locations);  // 원본 locations 데이터 전달
                } else {
                    console.warn('No hot locations found.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching hot locations:', error);
            }
        });
    }

    // 공유 장소 업데이트 함수
    function updateSidebar(locations) {
        const locationsList = $('#hot-locations');
        locationsList.empty();

        if (locations && locations.length > 0) {
            locations.forEach((location, index) => {
                const locationItem = $(`
                <div class="location-item">
                    <div class="item-header">
                        <div class="item-info">  <!-- 클릭 가능한 정보 영역 추가 -->
                            <h4>${location.location_nm || '이름 없음'}</h4>
                            <p>${location.location_desc || '설명 없음'}</p>
                            <p>작성자: ${location.username}</p>
                            <p>좋아요: ${location.like_count}개</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" class="location-toggle" data-index="${index}">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            `);

                // 벡터 소스와 레이어 생성
                const vectorSource = new ol.source.Vector();
                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([location.location_x, location.location_y])),
                    properties: location
                });
                feature.setId(index);
                vectorSource.addFeature(feature);

                const individualLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 1],
                            src: contextPath + '/js/marker.png'
                        })
                    }),
                    visible: false
                });

                map.addLayer(individualLayer);

                // 토글 이벤트 - 이벤트 전파 중지
                locationItem.find('.location-toggle').on('click', function(e) {
                    e.stopPropagation();  // 상위로의 이벤트 전파 중지
                    individualLayer.setVisible($(this).is(':checked'));
                });

                // 위치 클릭 이벤트 - 정보 영역에만 적용
                locationItem.find('.item-info').on('click', function() {
                    const coords = ol.proj.fromLonLat([location.location_x, location.location_y]);
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

    // 공유 레이어 업데이트 함수
    function updateSharedLocations() {
        console.log('updateSharedLocations 함수 호출됨');

        const locationsList = $('#shared-locations');
        locationsList.empty();

        $.ajax({
            url: contextPath + '/community.do',
            type: 'GET',
            dataType: 'json',
            success: function(locations) {
                console.log('서버 응답 데이터:', locations);

                $('#shared-content .location-count').text(locations.length + '개');

                if (locations && locations.length > 0) {
                    locations.forEach((location, index) => {
                        const locationItem = $(`
                        <div class="location-item">
                            <div class="item-header">
                                <div class="item-info">
                                    <h4>${location.location_nm}</h4>
                                    <p>${location.location_desc}</p>
                                    <p class="author-info">작성자: ${location.username}</p>
                                    <div class="like-section">
                                        <i class="bi ${location.liked === 'true' ? 'bi-heart-fill' : 'bi-heart'} like-button"
                                           data-shared-id="${location.shared_id}"
                                           data-liked="${location.liked}"></i>
                                        <span class="like-count">${location.like_count}</span>
                                    </div>
                                </div>
                                <div class="item-controls">
                                    <label class="switch">
                                        <input type="checkbox" class="location-toggle" data-index="${index}">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    `);

                        // 벡터 레이어 생성
                        const vectorSource = new ol.source.Vector();
                        const point = new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([location.location_x, location.location_y])),
                            properties: location
                        });
                        point.setId(index);
                        vectorSource.addFeature(point);

                        const individualLayer = new ol.layer.Vector({
                            source: vectorSource,
                            style: new ol.style.Style({
                                image: new ol.style.Icon({
                                    anchor: [0.5, 1],
                                    src: contextPath + '/images/marker.png'
                                })
                            }),
                            visible: false
                        });

                        map.addLayer(individualLayer);

                        // 토글 버튼 이벤트
                        locationItem.find('.location-toggle').on('click', function(e) {
                            e.stopPropagation();
                            individualLayer.setVisible($(this).is(':checked'));
                        });

                        // 장소 클릭 이벤트
                        locationItem.find('.item-info').on('click', function(e) {
                            if (!$(e.target).hasClass('like-button')) {
                                const coords = ol.proj.fromLonLat([location.location_x, location.location_y]);
                                map.getView().animate({
                                    center: coords,
                                    zoom: 18,
                                    duration: 1000
                                });
                            }
                        });

                        // 좋아요 버튼 클릭 이벤트
                        locationItem.find('.like-button').on('click', function() {

                            if (!username) {
                                alert('로그인이 필요한 서비스입니다.');
                                return;
                            }

                            const $button = $(this);
                            const sharedId = $button.attr('data-shared-id');
                            const isLiked = $button.data('liked') === true;  // 문자열 'true'와 비교

                            console.log('Request sending:', {
                                sharedId: sharedId,
                                action: isLiked ? 'unlike' : 'like'
                            });

                            $.ajax({
                                url: contextPath + '/like.do',
                                type: 'POST',
                                data: {
                                    sharedId: sharedId,
                                    action: isLiked ? 'unlike' : 'like'  // 컨트롤러가 기대하는 값
                                },
                                dataType: 'json',
                                success: function(response) {
                                    console.log('Server response:', response);

                                    if (response && response.success) {
                                        // 하트 아이콘 토글
                                        $button.toggleClass('bi-heart bi-heart-fill');
                                        // liked 상태 토글 (문자열로 저장)
                                        $button.data('liked', !isLiked);

                                        // 좋아요 수 업데이트
                                        const $likeCount = $button.siblings('.like-count');
                                        const currentCount = parseInt($likeCount.text());
                                        $likeCount.text(isLiked ? currentCount - 1 : currentCount + 1);
                                    } else {
                                        console.error('Invalid response:', response);
                                        alert(response?.message || '좋아요 처리 중 오류가 발생했습니다.');
                                    }
                                },
                                error: function(xhr, status, error) {
                                    console.error('AJAX Error:', {
                                        status: status,
                                        error: error,
                                        response: xhr.responseText,
                                        xhr: xhr
                                    });
                                    alert('서버 통신 중 오류가 발생했습니다.');
                                }
                            });
                        });

                        locationsList.append(locationItem);
                    });
                } else {
                    locationsList.html('<p class="no-locations">공유된 장소가 없습니다.</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('공유 장소 로드 중 오류:', error);
                locationsList.html('<p class="error-message">데이터를 불러오는 중 오류가 발생했습니다.</p>');
            }
        });
    }

// 교통레이어 버튼 클릭 이벤트
    $("#traffic_layer_btn").click(() => {
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
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