<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Map</title>
    <!-- OpenLayers CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@latest/en/v6.5.0/css/ol.css">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- OpenLayers JS -->
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@latest/en/v6.5.0/build/ol.js"></script>

    <!-- contextPath 설정 -->
    <script type="text/javascript">
        var contextPath = "${pageContext.request.contextPath}";
    </script>

    <!-- 커스텀 CSS -->
    <link rel="stylesheet" href="<c:url value='/css/mapMain.css'/>" type="text/css">
</head>
<body>
<h2>Map with Points</h2>
<button id="layer_btn">레이어 숨기기</button>
<div id="map"></div>

<!-- 커스텀 JS -->
<script src="<c:url value='/js/mapMain.js'/>"></script>
</body>
</html>