<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>로그인</title>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- contextPath 설정 -->
    <script type="text/javascript">
        var contextPath = "${pageContext.request.contextPath}";
    </script>

    <link rel="stylesheet" href="<c:url value='/css/login.css'/>" type="text/css">
</head>
<body>
<h2>로그인</h2>
<form id="loginForm">
    <div>
        <label for="username">사용자 이름:</label>
        <input type="text" id="username" name="username" required>
    </div>
    <div>
        <label for="password">비밀번호:</label>
        <input type="password" id="password" name="password" required>
    </div>
    <div>
        <button type="submit">로그인</button>
    </div>
</form>
<p>아직 회원이 아니신가요? <a href="${pageContext.request.contextPath}/signup.do">회원가입</a></p>
<script src="<c:url value='/js/login.js'/>"></script>
</body>
</html>