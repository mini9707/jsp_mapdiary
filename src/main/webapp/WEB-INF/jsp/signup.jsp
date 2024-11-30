<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>회원가입</title>
    <!-- contextPath 설정 -->
    <script type="text/javascript">
        var contextPath = "${pageContext.request.contextPath}";
    </script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css"> <!-- CSS 파일 연결 -->
</head>
<body>
<h2>회원가입</h2>
<form id="signupForm">
    <div>
        <label for="username">사용자 이름:</label>
        <input type="text" id="username" name="username" required>
    </div>
    <div>
        <label for="password">비밀번호:</label>
        <input type="password" id="password" name="password" required>
    </div>
    <div>
        <label for="email">이메일:</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div>
        <button type="submit">회원가입</button>
    </div>
</form>
<p>이미 회원이신가요? <a href="${pageContext.request.contextPath}/login.do">로그인</a></p>
<script src="<c:url value='/js/signup.js'/>"></script>
</body>
</html>