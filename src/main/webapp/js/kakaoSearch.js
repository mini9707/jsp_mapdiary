class SearchManager {
     // map: OpenLayers 맵 객체
     // searchMarker: 검색 결과 표시용 마커 레이어
    constructor() {
        this.map = null;
        this.searchMarker = null;  // 검색 위치 표시용 마커 레이어
        this.initSearchEvents();   // 검색 관련 이벤트 초기화
    }

    setMap(map) {
        this.map = map;
    }
    // 검색창 및 검색 버튼 이벤트 초기화
    initSearchEvents() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');

        // 검색창 클릭 시 카카오 주소 검색 팝업 오픈
        searchInput.addEventListener('click', () => {
            this.openKakaoAddress();
        });

        // 검색 버튼 클릭 시 카카오 주소 검색 팝업 오픈
        searchButton.addEventListener('click', () => {
            this.openKakaoAddress();
        });
    }


    // 검색 결과 위치에 마커 추가
    addMarker(coordinates) {
        // 기존 마커가 있다면 제거
        if (this.searchMarker) {
            this.map.removeLayer(this.searchMarker);
        }

        // 새로운 마커 레이어 생성
        const markerLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point(coordinates)
                    })
                ]
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: contextPath + '/img/location.png'
                })
            })
        });
        this.searchMarker = markerLayer;
        this.map.addLayer(markerLayer);
    }


    // * 카카오 주소 검색 팝업 오픈
    openKakaoAddress() {
        new daum.Postcode({
            oncomplete: (data) => {
                // 선택된 주소를 검색창에 표시
                document.getElementById('search-input').value = data.address;

                // 선택된 주소의 좌표 검색
                this.getCoordinates(data.address);
            }
        }).open();
    }


    // 주소로 좌표 검색
    // 카카오 로컬 API를 사용하여 주소의 좌표를 검색하고 지도에 표시
    getCoordinates(address) {
        $.ajax({
            url: `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            type: 'GET',
            headers: {
                'Authorization': `KakaoAK ${kakaoApiKey}`
            },
            success: (response) => {
                if (response.documents && response.documents.length > 0) {
                    const result = response.documents[0];
                    try {
                        // WGS84 좌표계(EPSG:4326) 좌표 추출
                        const coordinates = [
                            parseFloat(result.x),  // 경도
                            parseFloat(result.y)   // 위도
                        ];

                        console.log('원본 좌표 (4326):', coordinates);

                        // Web Mercator 좌표계(EPSG:3857)로 변환
                        const olCoordinates = ol.proj.transform(
                            coordinates,
                            'EPSG:4326',
                            'EPSG:3857'
                        );

                        console.log('변환된 좌표 (3857):', olCoordinates);

                        // 지도 이동 및 마커 표시
                        if (this.map) {
                            // 검색 위치로 지도 이동
                            this.map.getView().animate({
                                center: olCoordinates,  // 중심 좌표
                                zoom: 17,              // 줌 레벨
                                duration: 800          // 애니메이션 시간(ms)
                            });
                            // 검색 위치에 마커 추가
                            this.addMarker(olCoordinates);
                        } else {
                            console.error('맵 객체가 설정되지 않았습니다.');
                            util.alert('error', '맵 오류', '맵 객체를 찾을 수 없습니다.');
                        }
                    } catch (e) {
                        console.error('좌표 변환 에러:', e);
                        util.alert('error', '좌표 변환 실패', '좌표 변환 중 오류가 발생했습니다.');
                    }
                }
            },
            error: (xhr, status, error) => {
                console.error('API 요청 에러:', error);
                util.alert('error', '주소 검색 실패', '좌표를 가져오는 중 오류가 발생했습니다.');
            }
        });
    }
}