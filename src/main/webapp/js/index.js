// OpenLayers 지도 객체
var map;

// 각 탭별 레이어의 표시 상태 (key: 레이어 인덱스, value: 표시 여부)
var sharedLayerStates = {};
var hotLayerStates = {};
var myLayerStates = {};

// 지도에 추가된 모든 레이어 객체를 저장
// key: 레이어ID, value: OpenLayers Layer 객체
var allLayers = {};

// 장소 추가 모드의 활성화 상태
let isAddingLocation = false;

// 장소 추가 시 선택된 지도 좌표를 임시 저장
let currentCoordinates = null;

$(document).ready(function () {
    const searchManager = new SearchManager();

    // 로그인 상태 관리
    if (username) {
        $('#username').text(username + '님').show();
        $('#logout_btn').show();
        $('#login_btn, #signup_btn').hide();
        $('#add_location_btn').show();

    } else {
        $('#login_btn, #signup_btn').show();
        $('#logout_btn, #username').hide();
    }

    // 로그아웃 이벤트
    $('#logout_btn').on('click', function() {
        $.ajax({
            url: contextPath + "/logout.do",
            type: "POST",
            success: function() {
                location.reload();
            },
            error: function(xhr, status, error) {
                util.alert('error', '로그아웃에 실패했습니다', '로그아웃 기능에 오류가 발생했습니다.');
            }
        });
    });

    // 지도 초기화
    map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
        view: new ol.View({
            center: ol.proj.fromLonLat([126.7052, 37.4563]),
            zoom: 11
        })
    });

    searchManager.setMap(map);

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

    map.addLayer(itsLyr);

    // 탭 전환 이벤트
    $('.layer-tab').click(function() {
        const tabId = $(this).data('tab');

        if (tabId === 'my' && !username) {
            util.alert('warning', '로그인 필요', '이 서비스를 이용하려면 로그인이 필요합니다.');
            return;
        }

        $('.layer-tab').removeClass('active');
        $(this).addClass('active');
        $('.layer-content').removeClass('active');
        $(`#${tabId}-content`).addClass('active');

        if (tabId === 'hot') {
            updateHotLocations();
        } else if (tabId === 'shared') {
            updateSharedLocations();
        } else if (tabId === 'my') {
            updateMyLocations();
        }
    });

    // 교통레이어 버튼 클릭 이벤트
    $("#traffic_layer_btn").click(function() {
        $(this).toggleClass('active');
        const isVisible = itsLyr.getVisible();
        itsLyr.setVisible(!isVisible);
    });

    $('#closeInfoBtn').click(() => $('#info-popup').hide());

    // 내 장소 추가 버튼 클릭 이벤트
    $('#add_location_btn').click(function() {
        $(this).toggleClass('active');
        isAddingLocation = $(this).hasClass('active');
        $('#map').css('cursor', isAddingLocation ? 'crosshair' : 'default');

        if (isAddingLocation) {
            util.alert('info', '위치 선택', '지도에서 추가할 위치를 클릭해주세요.');
        }
    });

    // 지도 클릭 이벤트
    map.on('click', function(evt) {
        if (isAddingLocation) {
            handleAddLocationClick(evt);
        } else {
            handleLayerClick(evt);
        }
    });

    // 초기 데이터 로드
    updateHotLocations();
});

// 내 레이어 업데이트 함수 수정
function updateMyLocations() {
    if (!username || !userId) {
        util.alert('warning', '로그인 필요', '이 서비스를 이용하려면 로그인이 필요합니다.');
        return;
    }

    const locationsList = $('#my-locations');
    locationsList.empty();

    // WFS 요청 URL과 파라미터
    const wfsUrl = 'http://localhost:8080/geoserver/new/ows';
    const wfsParams = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'new:locations',
        outputFormat: 'application/json',
        maxFeatures: 1000,
        CQL_FILTER: `user_id=${userId}`
    };

    $.ajax({
        url: wfsUrl,
        data: wfsParams,
        dataType: 'json',
        success: function(response) {
            if (response.features && response.features.length > 0) {
                response.features.forEach((feature, index) => {
                    const wasVisible = myLayerStates[index] || false;
                    const coords = feature.geometry.coordinates;

                    console.log(feature.properties)
                    // 레이어 생성
                    const location = {
                        location_x: coords[0],
                        location_y: coords[1],
                        location_nm: feature.properties.location_nm,
                        location_desc: feature.properties.location_desc,
                        location_id: feature.properties.location_id
                    };

                    const layer = addLayer(location, index, 'my');

                    // 위치 항목 생성
                    const locationItem = $(`
                        <div class="location-item">
                            <div class="item-header">
                                <div class="item-info">
                                    <h4>${feature.properties.location_nm || '이름 없음'}</h4>
                                    <p>${feature.properties.location_desc || '설명 없음'}</p>
                                    <p>작성자: ${username}</p>  <!-- 현재 로그인한 사용자명 표시 -->
                                </div>
                                <div class="item-controls">
                                    <div class="control-group">
                                        <button class="delete-btn" 
                                                data-location-id="${feature.properties.location_id}">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                        <button class="share-btn ${feature.properties.is_shared ? 'shared' : ''}" 
                                                data-location-id="${feature.properties.location_id}">
                                            <i class="bi ${feature.properties.is_shared ? 'bi-share-fill' : 'bi-share'}"></i>
                                        </button>
                                        <label class="switch">
                                            <input type="checkbox" class="location-toggle" 
                                                data-index="${index}"
                                                ${wasVisible ? 'checked' : ''}>
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);


                    // 공유 버튼 클릭 이벤트
                    locationItem.find('.share-btn').on('click', function() {
                        const locationId = $(this).data('location-id');
                        const isCurrentlyShared = $(this).hasClass('shared');
                        updateSharedStatus(locationId, !isCurrentlyShared);
                    });

                    // 삭제 버튼 클릭 이벤트 추가
                    locationItem.find('.delete-btn').on('click', function() {
                        const locationId = $(this).data('location-id');
                        if(confirm('정말 이 장소를 삭제하시겠습니까?')) {
                            $.ajax({
                                url: contextPath + '/map/deleteLocation.do',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({ locationId: locationId }),
                                beforeSend: function() {
                                },
                                success: function(response) {
                                    util.alert('info', '장소 삭제', '해당 장소가 삭제되었습니다.');
                                    updateMyLocations();
                                },
                                error: function(xhr, status, error) {
                                    console.error('장소 삭제 실패:', error);
                                    console.error('상태 코드:', xhr.status);
                                    console.error('응답 텍스트:', xhr.responseText);
                                    util.alert('error', '장소 삭제', '해당 장소 삭제 중 오류가 발생했습니다.');
                                    alert('장소 삭제 중 오류가 발생했습니다.');
                                }
                            });
                        }
                    });

                    // 토글 이벤트
                    locationItem.find('.location-toggle').on('click', function(e) {
                        e.stopPropagation();
                        const isVisible = $(this).is(':checked');
                        const layerId = 'my_' + index;

                        if (allLayers[layerId]) {
                            allLayers[layerId].setVisible(isVisible);
                            myLayerStates[index] = isVisible;
                        }
                    });

                    // 위치 클릭 이벤트
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
                locationsList.html('<p class="no-locations">등록된 장소가 없습니다.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('WFS 요청 에러:', {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText
            });
            locationsList.html('<p class="error-message">데이터를 불러오는 중 오류가 발생했습니다.</p>');
        }
    });
}

// 레이어 제거 함수
function removeLayer(layerId) {
    if (allLayers[layerId]) {
        map.removeLayer(allLayers[layerId]);
        delete allLayers[layerId];
    }
}

// 레이어 추가 함수
function addLayer(location, index, type) {
    const layerId = type + '_' + index;
    let isVisible;

    switch(type) {
        case 'hot':
            isVisible = hotLayerStates[index] || false;
            break;
        case 'shared':
            isVisible = sharedLayerStates[index] || false;
            break;
        case 'my':
            isVisible = myLayerStates[index] || false;
            break;
        default:
            isVisible = false;
    }

    const vectorSource = new ol.source.Vector();
    const feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([location.location_x, location.location_y])),
        properties: location
    });

    const layer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: contextPath + '/img/location.png'
            })
        }),
        visible: false
    });

    vectorSource.addFeature(feature);

    removeLayer(layerId);
    map.addLayer(layer);
    allLayers[layerId] = layer;

    return layer;
}

// 인기 장소 업데이트 함수
function updateHotLocations() {
    $.ajax({
        url: contextPath + '/getHotLocations.do',
        type: 'GET',
        success: function(locations) {
            if (locations && locations.length > 0) {
                updateSidebar(locations);
            } else {
                console.warn('No hot locations found.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching hot locations:', error);
        }
    });
}

// 공유 상태 업데이트 함수 추가
function updateSharedStatus(locationId, isShared) {
    if (isShared) {
        $.ajax({
            url: contextPath + '/updateLocationSharedStatus.do',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                locationId: locationId,
                isShared: true
            }),
            success: function(response) {
                const sharedLocation = {
                    locationId: locationId,
                    sharedUserId: userId
                };
                $.ajax({
                    url: contextPath + '/saveSharedLocation.do',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(sharedLocation),
                    success: function(response) {
                        const $btn = $(`.share-btn[data-location-id="${locationId}"]`);
                        $btn.addClass('shared');
                        $btn.find('i').removeClass('bi-share').addClass('bi-share-fill');
                        showToast('장소가 공유되었습니다.');
                    },
                    error: function(xhr, status, error) {
                        console.error('공유 실패:', error);
                        showToast('공유 처리 중 오류가 발생했습니다.');
                    }
                });
            }
        });
    } else {
        $.ajax({
            url: contextPath + '/checkLikes.do',
            type: 'GET',
            data: { locationId: locationId },
            success: function(response) {
                if (response.success) {
                    if (response.likeCount > 0) {
                        // 좋아요가 있는 경우 확인 창 표시
                        util.alert(
                            'question',
                            '공유 취소 확인',
                            '이 장소에 좋아요가 있습니다.\n정말 공유를 취소하시겠습니까?',
                            function() {
                                // 확인 버튼 클릭 시
                                deleteSharedLocation(locationId);
                            },
                            function() {
                                // 취소 버튼 클릭 시
                                return false; // 아무 동작도 하지 않음
                            }
                        );
                    } else {
                        // 좋아요가 없는 경우 바로 삭제
                        deleteSharedLocation(locationId);
                    }
                }
            },
            error: function(xhr, status, error) {
                util.alert('error', '확인 실패', '좋아요 개수를 확인하는 중 오류가 발생했습니다.');
            }
        });
    }
}

// 공유 삭제 함수
function deleteSharedLocation(locationId) {
    $.ajax({
        url: contextPath + '/updateLocationSharedStatus.do',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            locationId: locationId,
            isShared: false
        }),
        success: function(response) {
            const deleteRequest = {
                locationId: locationId,
                sharedUserId: userId
            };

            $.ajax({
                url: contextPath + '/deleteSharedLocation.do',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(deleteRequest),
                success: function(response) {
                    const $btn = $(`.share-btn[data-location-id="${locationId}"]`);
                    $btn.removeClass('shared');
                    $btn.find('i').removeClass('bi-share-fill').addClass('bi-share');
                    showToast('공유가 취소되었습니다.');
                },
                error: function(xhr, status, error) {
                    console.error('공유 취소 실패:', error);
                    showToast('공유 취소 중 오류가 발생했습니다.');
                }
            });
        }
    });
}

// 토스트 메시지 함수
function showToast(message) {
    const toast = $(`<div class="toast">${message}</div>`);
    $('body').append(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// 인기 장소 사이드바 업데이트
function updateSidebar(locations) {
    const locationsList = $('#hot-locations');
    locationsList.empty();

    if (locations && locations.length > 0) {
        locations.forEach((location, index) => {
            const wasVisible = hotLayerStates[index] || false;
            const layer = addLayer(location, index, 'hot');

            const locationItem = $(`
                <div class="location-item">
                    <div class="item-header">
                        <div class="item-info">
                            <h4>${location.location_nm || '이름 없음'}</h4>
                            <p>${location.location_desc || '설명 없음'}</p>
                            <p>작성자: ${location.username}</p>
                            <p>좋아요: ${location.like_count}개</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" class="location-toggle" 
                                data-index="${index}"
                                ${wasVisible ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            `);

            locationItem.find('.location-toggle').on('click', function(e) {
                e.stopPropagation();
                const isVisible = $(this).is(':checked');
                const layerId = 'hot_' + index;

                if (allLayers[layerId]) {
                    allLayers[layerId].setVisible(isVisible);
                    hotLayerStates[index] = isVisible;
                }
            });

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

// 공유 장소 업데이트 함수
function updateSharedLocations() {
    const locationsList = $('#shared-locations');
    locationsList.empty();

    $.ajax({
        url: contextPath + '/community.do',
        type: 'GET',
        dataType: 'json',
        success: function(locations) {
            if (locations && locations.length > 0) {
                locations.forEach((location, index) => {
                    const wasVisible = sharedLayerStates[index] || false;
                    const layer = addLayer(location, index, 'shared');

                    const locationItem = $(`
                        <div class="location-item">
                            <div class="item-header">
                                <div class="item-info">
                                    <h4>${location.location_nm}</h4>
                                    <p>${location.location_desc}</p>
                                    <p class="author-info">작성자: ${location.username}</p>
                                    <div class="like-section">
                                        <i class="bi ${location.liked === 'true' ? 'bi-heart-fill' : 'bi-heart'} like-button"
                                           data-shared-id="${location.shared_id}"></i>
                                        <span class="like-count">${location.like_count}</span>
                                    </div>
                                </div>
                                <div class="item-controls">
                                    <label class="switch">
                                        <input type="checkbox" class="location-toggle" 
                                            data-index="${index}"
                                            ${wasVisible ? 'checked' : ''}>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    `);

                    locationItem.find('.location-toggle').on('click', function(e) {
                        e.stopPropagation();
                        const isVisible = $(this).is(':checked');
                        const layerId = 'shared_' + index;

                        if (allLayers[layerId]) {
                            allLayers[layerId].setVisible(isVisible);
                            sharedLayerStates[index] = isVisible;
                        }
                    });

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

                    locationItem.find('.like-button').on('click', function() {
                        if (!username) {
                            alert('로그인이 필요한 서비스입니다.');
                            return;
                        }

                        const $button = $(this);
                        if ($button.data('processing')) return;

                        const sharedId = $button.attr('data-shared-id');
                        const isLiked = $button.hasClass('bi-heart-fill');
                        $button.data('processing', true);

                        $.ajax({
                            url: contextPath + '/like.do',
                            type: 'POST',
                            data: {
                                sharedId: sharedId,
                                action: isLiked ? 'unlike' : 'like'
                            },
                            success: function(response) {
                                if (response.success) {
                                    if (isLiked) {
                                        $button.removeClass('bi-heart-fill').addClass('bi-heart');
                                        const newCount = parseInt($button.siblings('.like-count').text()) - 1;
                                        $button.siblings('.like-count').text(newCount);
                                    } else {
                                        $button.removeClass('bi-heart').addClass('bi-heart-fill');
                                        const newCount = parseInt($button.siblings('.like-count').text()) + 1;
                                        $button.siblings('.like-count').text(newCount);
                                    }
                                } else {
                                    alert(response.message || '좋아요 처리 중 오류가 발생했습니다.');
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('AJAX 오류:', error);
                                alert('서버 통신 중 오류가 발생했습니다.');
                            },
                            complete: function() {
                                $button.data('processing', false);
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

// 지도 클릭 핸들러
function handleMapClick(evt) {
    const coords = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

    // 팝업 표시
    $('#add-location-popup').show();

    // 저장 버튼 클릭 이벤트
    $('#save-location-btn').one('click', function() {
        const locationName = $('#location-name').val();
        const locationDesc = $('#location-desc').val();

        if (!locationName) {
            alert('장소 이름을 입력해주세요.');
            return;
        }

        $.ajax({
            url: contextPath + '/map/insertLocation.do',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                locationName: locationName,
                locationDesc: locationDesc,
                locationX: coords[0],
                locationY: coords[1],
                userId: userId
            }),
            success: function(response) {
                if (response) {
                    alert('장소가 추가되었습니다.');
                    closeAddLocationPopup();
                    updateMyLocations();
                } else {
                    alert('장소 추가에 실패했습니다.');
                }
            },
            error: function(xhr, status, error) {
                console.error('장소 추가 실패:', error);
                alert('장소 추가 중 오류가 발생했습니다.');
            }
        });
    });
}

// 레이어 클릭 핸들러
function handleLayerClick(evt) {
    let clickedFeature = null;
    map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        if (!clickedFeature && feature.get('properties')) {
            clickedFeature = feature;
            return true;
        }
    });

    if (clickedFeature) {
        showLayerInfo(clickedFeature);
    }
}

// 팝업 닫기 함수
function closeAddLocationPopup() {
    $('#add-location-popup').hide();
    $('#location-name').val('');
    $('#location-desc').val('');
    isAddingLocation = false;
    currentCoordinates = null;
    $('#add_location_btn').removeClass('active');
    $('#map').css('cursor', 'default');
}

// 장소 추가 클릭 핸들러
function handleAddLocationClick(evt) {
    currentCoordinates = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

    $('#add-location-popup').show();

    $('#save-location-btn').one('click', function() {
        const locationName = $('#location-name').val();
        const locationDesc = $('#location-desc').val();

        if (!locationName) {
            alert('장소 이름을 입력해주세요.');
            return;
        }

        $.ajax({
            url: contextPath + '/map/insertLocation.do',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                locationNm: locationName,
                locationDesc: locationDesc,
                locationX: currentCoordinates[0],
                locationY: currentCoordinates[1]
            }),
            success: function(locationVO) {
                alert('장소가 추가되었습니다.');
                closeAddLocationPopup();
                updateMyLocations();
            },
            error: function(xhr, status, error) {
                console.error('장소 추가 실패:', error);
                alert('장소 추가 중 오류가 발생했습니다.');
            }
        });
    });
}

// 레이어 정보 팝업 표시
function showLayerInfo(feature) {
    const properties = feature.get('properties');
    $('#location-title').text(properties.location_nm);
    $('#location-desc').text(properties.location_desc);
    $('#location-author').text(`작성자: ${properties.username}`);
    $('#location-popup').show();
}

// 팝업 닫기 버튼 이벤트
$('#location-close-btn').click(function() {
    $('#location-popup').hide();
});

// 팝업 닫기 버튼 이벤트
$('#add-location-close-btn, #cancel-location-btn').click(closeAddLocationPopup);