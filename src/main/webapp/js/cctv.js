let cctv = {
    list: [],
    layer:null,
    active:null,
};

$('#cctv_layer_btn').on('click', function () {
    $(this).toggleClass('active');
    toggleCctv($(this).hasClass('active'));
});

async function toggleCctv(on) {
    cctv.list = await getCCTV();
    if (on) {
        if (cctv.layer) {
            cctv.layer.setVisible(true)
        } else {
            makeCctvLayer();
        }
    } else {
        cctv.layer.setVisible(false)
    }
}

function getCCTV() {
    if (cctv.list.length !== 0) return cctv.list;

    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'getCctvList.do',
            type: 'GET',
            dataType: 'json',
            success: resolve,
            error: reject
        });
    });
}

function makeCctvLayer() {
    var style = new ol.style.Style({
        image: new ol.style.Icon({
            src: '/img/cctv.png', // Replace with your icon URL
            // anchor: [0.5, 1], // 앵커 위치
            scale: 1,       // 크기 조정
        }),
    });

    var features = cctv.list.map((cctv) => {
        var feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([cctv.coorx, cctv.coory])),
            data: cctv,
        });
        feature.setStyle(style);

        feature.onClick = function () {
            viewCctv(cctv);
        };

        return feature;
    });

    cctv.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: features,
        }),
    });
    map.addLayer(cctv.layer);


    map.on('singleclick', handleCctvClick);
}

function handleCctvClick(evt) {
    var clickedFeature = null;
    map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        if (!clickedFeature) {
            clickedFeature = feature; // 첫 번째 피처 저장
            if (feature.onClick) feature.onClick();
        }
    });
}


function viewCctv(data) {
    console.log('CCTV Data:', data);
    if(!data) return;

    $('#cctv-popup').show()
    $('#cctvTitle').text(data.name);
    $('#cctvMain').empty();

    var hls, video;

    // 비디오 요소 생성
    var $video = `<video id="cctvVideo" controls autoplay style="width: 100%; height: 100%;"></video>`;

    // modal-body를 비우고 비디오 요소 추가
    $('#cctvMain').empty().append($video);

    // HLS.js를 사용하여 비디오 스트리밍 설정
    video = document.getElementById('cctvVideo');
    if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(data.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
        // 에러처리
        hls.on(Hls.Events.ERROR, () => updateCctv());

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = data.url;
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    } else {
        console.error('HLS is not supported in this browser.');
    }

    // 종료
    $('#cctvStop').click(()=> {
        if (video) {
            video.pause();
            video.src = ''; // 스트림 해제
        }
        // HLS.js 인스턴스 해제
        if (hls) {
            hls.destroy();
            hls = null;
        }
        $('#cctv-popup').hide()
    })
}

function updateCctv() {
    // 데이터 다시 불러오기
    $.ajax({
        url: 'updateCctv.do',
        type: 'POST',
    }).done(function () {
        $('#cctv_layer_btn').removeClass('active');
        map.un('singleclick', handleCctvClick);

        cctv = {
            list: [],
            layer:null,
            active:null,
        };
        alert('cctv 조회 에러 발생');
    });
}