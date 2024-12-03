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
    <!-- OpenLayers CSS -->
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@latest/en/v6.5.0/css/ol.css">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- OpenLayers JS -->
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@latest/en/v6.5.0/build/ol.js"></script>

    <!-- contextPath 설정 -->
    <script type="text/javascript">
        var contextPath = "${pageContext.request.contextPath}";
        var username = "${sessionScope.user.username != null ? sessionScope.user.username : ''}";// 세션에서 사용자 객체 가져오기
        var userId = "${sessionScope.user.id}";  // userId 추가
    </script>

    <!-- 커스텀 CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css" type="text/css">
</head>

<body>
<!-- 네비게이션 바 include -->
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
        <!-- 인기 레이어 탭 -->
        <div class="layer-content active" id="hot-content">
            <div class="location-list" id="hot-locations"></div>
        </div>

        <!-- 공유 레이어 탭 -->
        <div class="layer-content" id="shared-content">
            <div class="location-list" id="shared-locations"></div>
        </div>

        <!-- 내 레이어 탭 -->
        <div class="layer-content" id="my-content">
            <div class="layer-list"></div>
            <div class="location-list" id="my-locations"></div>
        </div>
    </div>
</div>

<!-- 레이어 버튼 추가 -->
<div class="layer-buttons">
    <button id="traffic_layer_btn">교통 레이어</button>
    <button id="cctv_layer_btn">CCTV 레이어</button>
    <button id="add_location_btn" style="display: none;">내 장소 추가</button>
</div>

<div id="cctv-popup" style="display: none;
position: absolute; top: 250px; right: 2%; background: #5b5858; width: 350px; height: 300px; z-index: 9999; padding: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div id="cctvTitle" style="color: #fff;">제목</div>
        <button id="cctvStop" style="background-color: #f44336; color: white; border: none; padding: 5px 10px; cursor: pointer;">닫기</button>
    </div>
    <div style="height: 250px;">
        <div style="border: 1px solid #000000; height: 88%;" id="cctvMain"></div>
    </div>
</div>

<div id="map"></div>

<!-- CCTV 팝업 -->
<div id="cctv-popup" style="display: none;
position: absolute; top: 250px; right: 2%; background: #5b5858; width: 350px; height: 300px; z-index: 9999; padding: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div id="cctvTitle" style="color: #fff;">제목</div>
        <button id="cctvStop" style="background-color: #f44336; color: white; border: none; padding: 5px 10px; cursor: pointer;">닫기</button>
    </div>
    <div style="height: 250px;">
        <div style="border: 1px solid #000000; height: 88%;" id="cctvMain"></div>
    </div>
</div>

<!-- 장소 정보 팝업 -->
<div id="location-popup" class="popup" style="display: none;">
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
<div id="add-location-popup" class="popup" style="display: none;">
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

<script src="<c:url value='/js/index.js'/>"></script>
<script src="<c:url value='/js/hls.js'/>"></script>
<script src="<c:url value='/js/cctv.js'/>"></script>
</body>

</html>