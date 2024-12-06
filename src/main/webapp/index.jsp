<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Map</title>

    <!-- CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@latest/en/v6.5.0/css/ol.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/sweetalert2.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css">

    <!-- JavaScript -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@latest/en/v6.5.0/build/ol.js">//OpenLayers api</script>

    <!-- 전역 변수 -->
    <script>
        var contextPath = "${pageContext.request.contextPath}";
        var username = "${sessionScope.user.username != null ? sessionScope.user.username : ''}";
        var userId = "${sessionScope.user.id}";
        var kakaoApiKey = "${kakaoApiKey}";
    </script>
</head>

<body>
<!-- 네비게이션 바 -->
<jsp:include page="/WEB-INF/jsp/nav.jsp" />

<!-- 사이드바 -->
<div id="sidebar" class="sidebar-expanded">
    <div class="sidebar-header">
        <h3>지도 레이어</h3>
    </div>

    <div class="layer-tabs">
        <button class="layer-tab active" data-tab="hot">인기 레이어</button>
        <button class="layer-tab" data-tab="shared">공유 레이어</button>
        <button class="layer-tab" data-tab="my" id="my-layer-tab">내 레이어</button>
    </div>

    <div class="layer-contents">
        <div class="layer-content active" id="hot-content">
            <div class="location-list" id="hot-locations"></div>
        </div>
        <div class="layer-content" id="shared-content">
            <div class="location-list" id="shared-locations"></div>
        </div>
        <div class="layer-content" id="my-content">
            <div class="layer-list"></div>
            <div class="location-list" id="my-locations"></div>
        </div>
    </div>
</div>

<!-- 레이어 버튼 -->
<div class="layer-buttons">
    <button id="traffic_layer_btn">교통 레이어</button>
    <button id="cctv_layer_btn">CCTV 레이어</button>
    <button id="add_location_btn" style="display: none;">내 장소 추가</button>
</div>

<!-- 지도 -->
<div id="map"></div>

<!-- CCTV 팝업 -->
<div id="cctv-popup" class="cctv-popup">
    <div class="cctv-header">
        <div id="cctvTitle"></div>
        <button id="cctvStop">닫기</button>
    </div>
    <div class="cctv-content">
        <div id="cctvMain"></div>
    </div>
</div>

<!-- 장소 정보 팝업 -->
<div id="location-popup" class="popup">
    <div class="popup-header">
        <h3 id="location-title"></h3>
        <button id="location-close-btn" class="close-btn">&times;</button>
    </div>
    <div class="popup-content">
        <p id="location-desc"></p>
        <p id="location-author"></p>
        <div id="location-likes"></div>
    </div>
</div>

<!-- 장소 추가 팝업 -->
<div id="add-location-popup" class="popup">
    <div class="popup-header">
        <h3>새 장소 추가</h3>
        <button id="add-location-close-btn" class="close-btn">&times;</button>
    </div>
    <div class="popup-content">
        <input type="text" id="location-name" placeholder="장소 이름">
        <textarea id="location-desc" placeholder="장소 설명"></textarea>
        <div class="popup-buttons">
            <button id="save-location-btn">저장</button>
            <button id="cancel-location-btn">취소</button>
        </div>
    </div>
</div>

<!-- Scripts -->
<script src="<c:url value='/js/sweetalert2.all.min.js'/>"></script>
<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=cb7f75f8c2f033a54bf2eb635bbe3f91&libraries=services"></script>
<script src="<c:url value='/js/kakaoSearch.js'/>"></script>
<script src="<c:url value='/js/util.js'/>"></script>
<script src="<c:url value='/js/index.js'/>"></script>
<script src="<c:url value='/js/hls.js'/>"></script>
<script src="<c:url value='/js/cctv.js'/>"></script>
</body>
</html>