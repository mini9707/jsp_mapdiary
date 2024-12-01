<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MyPlace</title>
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
    var username = "${sessionScope.user.username != null ? sessionScope.user.username : ''}"; // 세션에서 사용자 객체 가져오기
    var userId = "${sessionScope.user.id}";
  </script>

  <!-- 커스텀 CSS -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css" type="text/css">
</head>
<body>

<!-- 네비게이션 바 include -->
<jsp:include page="/WEB-INF/jsp/nav.jsp" />

<!-- 레이어 버튼 -->
<div class="layer-buttons">
  <button id="hot_btn">Hot</button>
  <button id="traffic_layer_btn">교통 레이어</button>
  <button id="cctv_layer_btn">CCTV 레이어</button>
</div>

<!-- 사이드바 -->
<div id="sidebar" class="sidebar">
  <div class="sidebar-header">
    <h3>현재 지도 범위 내 위치</h3>
    <button id="close_sidebar" class="close-button">&times;</button>
  </div>
  <div id="locations-list" class="locations-list">

  </div>
</div>

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
    <h4 id="info-title"></h4>
    <p id="info-description"></p>
    <input type="checkbox" id="shareLocationCheckbox"> 공유하기
    <button id="saveSharedLocationBtn">저장</button>
    <button id="closeInfoBtn">닫기</button>
  </div>
</div>

<!-- 커스텀 JS -->
<script src="<c:url value='/js/myplace.js'/>"></script>
</body>
</html>