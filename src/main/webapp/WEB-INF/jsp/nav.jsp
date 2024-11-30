<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<style>
  .logo a {
    text-decoration: none;
    color: inherit;
  }

  .logo a:hover {
    text-decoration: none;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f8f8f8;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .header .logo {
    font-size: 24px;
    font-weight: bold;
  }

  /* 네비게이션 링크 스타일 */
  .nav-links {
    display: flex;
    gap: 20px; /* 링크 간격 */
  }

  .nav-links a {
    text-decoration: none;
    color: #4CAF50; /* 링크 색상 */
    font-weight: bold;
  }

  .nav-links a:hover {
    text-decoration: underline; /* 마우스 오버 시 밑줄 */
  }
</style>

<div class="header">
  <div class="logo">
    <a href="${pageContext.request.contextPath}/">MapDiary</a>
  </div>
  <div class="nav-links">
    <a href="${pageContext.request.contextPath}/community.do">Community</a>
    <a href="${pageContext.request.contextPath}/myplace.do">MyPlace</a>
  </div>
  <div class="auth-buttons">
    <span id="username" style="display: none;"></span>
    <button id="login_btn" style="display: none;" onclick="location.href='${pageContext.request.contextPath}/login.do'">로그인</button>
    <button id="signup_btn" style="display: none;" onclick="location.href='${pageContext.request.contextPath}/signup.do'">회원가입</button>
    <button id="logout_btn" style="display: none;">로그아웃</button>
  </div>
</div>