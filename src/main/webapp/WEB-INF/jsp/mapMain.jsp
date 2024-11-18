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
    </script>

    <!-- 커스텀 CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/mapMain.css" type="text/css">
</head>
<body>
<h2>Map with Points</h2>
<button id="layer_btn">레이어 숨기기</button>
<div id="map"></div>

<!-- 입력 폼 팝업 -->
<div id="popup-form" class="popup-overlay">
    <div class="popup-content">
        <h3>위치 정보 입력</h3>
        <form id="locationForm">
            <div>
                <label for="locationNm">장소</label>
                <input type="text" id="locationNm" name="locationNm" required>
            </div>
            <div>
                <label for="locationDesc">기록</label>
                <textarea id="locationDesc" name="locationDesc" required></textarea>
            </div>
            <div class="button-group">
                <button type="submit">저장</button>
                <button type="button" id="cancelBtn">취소</button>
            </div>
        </form>
    </div>
</div>

<!-- 정보 표시 팝업 -->
<div id="info-popup" class="info-popup">
    <div class="info-content">
        <h3 id="info-title"></h3>
        <p id="info-description"></p>
        <button type="button" id="closeInfoBtn">닫기</button>
    </div>
</div>

<!-- 커스텀 JS -->
<script src="<c:url value='/js/mapMain.js'/>"></script>
</body>
</html>