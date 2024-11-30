<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Community - MapDiary</title>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- 커스텀 CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/community.css" type="text/css">

    <!-- contextPath 설정 -->
    <script type="text/javascript">
        var contextPath = "${pageContext.request.contextPath}";
        var username = "${sessionScope.user.username != null ? sessionScope.user.username : ''}";
        var userId = "${sessionScope.user.id}";
    </script>
</head>
<body>
<!-- 네비게이션 바 include -->
<jsp:include page="/WEB-INF/jsp/nav.jsp" />

<!-- 게시글 목록 -->
<div class="community-container">
    <h2 class="mb-4">공유된 장소</h2>

    <c:choose>
        <c:when test="${not empty sharedLocations}">
            <c:forEach items="${sharedLocations}" var="location">
                <div class="location-card">
                    <h3 class="location-title">${location.location_nm}</h3>
                    <p class="location-desc">${location.location_desc}</p>
                    <div class="location-meta">
                        <span class="author">작성자: ${location.username}</span>
                        <span class="date">
                <fmt:formatDate value="${location.shared_at}" pattern="yyyy-MM-dd HH:mm"/>
            </span>
                    </div>
                </div>
            </c:forEach>
        </c:when>
        <c:otherwise>
            <div class="empty-message">
                <p>공유된 장소가 없습니다.</p>
            </div>
        </c:otherwise>
    </c:choose>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- 커스텀 JS -->
<script src="<c:url value='/js/community.js'/>"></script>
</body>
</html>