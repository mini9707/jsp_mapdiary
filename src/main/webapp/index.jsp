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
    </script>

    <!-- 커스텀 CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css" type="text/css">
</head>

<body>
<!-- 네비게이션 바 include -->
<jsp:include page="/WEB-INF/jsp/nav.jsp" />

<!-- 레이어 버튼 추가 -->
<div class="layer-buttons">
    <button id="hot_btn">Hot</button>
    <button id="traffic_layer_btn">교통 레이어</button>
    <button id="cctv_layer_btn">CCTV 레이어</button>
</div>

<!-- 메뉴 버튼 추가 -->
<button id="menu_btn" class="menu-button">
    <i class="fas fa-bars"></i>
</button>

<!-- 사이드바 추가 -->`
<div id="sidebar" class="sidebar">
    <div class="sidebar-header">
        <h3>인기 장소</h3>
        <button id="close_sidebar" class="close-button">&times;</button>
    </div>
    <div id="locations-list" class="locations-list">
    </div>
</div>

<div id="map"></div>

<!-- 정보 표시 팝업 -->
<div id="info-popup" class="info-popup">
    <div class="info-content">
        <h3 id="info-title"></h3>
        <p id="info-description"></p>
        <button type="button" id="closeInfoBtn">닫기</button>
    </div>
</div>

<!-- 커스텀 JS -->
<script src="<c:url value='/js/index.js'/>"></script>
</body>
</html>