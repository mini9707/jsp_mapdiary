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

<%--    <div class="search-box">--%>
<%--        <select class="category-select">--%>
<%--            <option value="">전체</option>--%>
<%--            <!-- 카테고리 옵션들 -->--%>
<%--        </select>--%>
<%--        <div class="search-input-wrapper">--%>
<%--            <input type="text" placeholder="검색어를 입력해주세요" class="search-input">--%>
<%--            <button class="search-btn"><i class="fas fa-search"></i></button>--%>
<%--        </div>--%>
<%--    </div>--%>

    <div class="layer-contents">
        <!-- 인기 레이어 탭 -->
        <div class="layer-content active" id="hot-content">
            <div class="location-list" id="hot-locations"></div>
        </div>

        <!-- 공유 레이어 탭 -->
        <div class="layer-content" id="shared-content">
            <div class="layer-list">
                <div class="layer-item">
                    <div class="layer-toggle">
                        <input type="checkbox" id="shared_layer_toggle">
                        <label for="shared_layer_toggle">공유된 장소</label>
                        <input type="checkbox" id="shared_label_toggle" class="label-toggle">
                        <label for="shared_label_toggle" class="label-toggle-btn">라벨</label>
                    </div>
                    <span class="location-count">0개</span>
                </div>
            </div>
            <div class="location-list" id="shared-locations">

            </div>
        </div>

        <!-- 내 레이어 탭 -->
        <div class="layer-content" id="my-content">
            <div class="layer-list">
                <div class="layer-item">
                    <div class="layer-toggle">
                        <input type="checkbox" id="my_layer_toggle">
                        <label for="my_layer_toggle">내 장소</label>
                        <input type="checkbox" id="my_label_toggle" class="label-toggle">
                        <label for="my_label_toggle" class="label-toggle-btn">라벨</label>
                    </div>
                    <span class="location-count">5개</span>
                </div>
            </div>
            <div class="location-list" id="my-locations"></div>
        </div>
    </div>
</div>

<!-- 레이어 버튼 추가 -->
<div class="layer-buttons">
    <button id="traffic_layer_btn">교통 레이어</button>
    <button id="cctv_layer_btn">CCTV 레이어</button>
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

<script src="<c:url value='/js/index.js'/>"></script>
</body>

</html>