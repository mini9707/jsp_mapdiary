<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .logo a {
    text-decoration: none;
    color: #3b5bdb;
    font-size: 24px;
    font-weight: bold;
  }

  .logo a:hover {
    color: #364fc7;
  }

  /* 네비게이션 링크 스타일 */
  .nav-links {
    display: flex;
    gap: 20px;
  }

  .nav-links a {
    text-decoration: none;
    color: #495057;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .nav-links a:hover {
    background-color: #f1f3f9;
    color: #3b5bdb;
    text-decoration: none;
  }

  /* 인증 버튼 스타일 */
  .auth-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .auth-buttons button {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  #username {
    color: #495057;
    font-weight: 500;
    margin-right: 10px;
  }

  #login_btn {
    background-color: white;
    color: #3b5bdb;
    border: 1px solid #3b5bdb;
  }

  #login_btn:hover {
    background-color: #f1f3f9;
  }

  #signup_btn {
    background-color: #3b5bdb;
    color: white;
    border: none;
  }

  #signup_btn:hover {
    background-color: #364fc7;
  }

  #logout_btn {
    background-color: #e9ecef;
    color: #495057;
    border: none;
  }

  #logout_btn:hover {
    background-color: #dee2e6;
  }

  /* 검색 컨테이너 스타일 */
  .search-container {
    flex: 1;
    max-width: 400px;
    margin: 0 20px;
  }

  .search-input-group {
    display: flex;
    align-items: center;
    background-color: #f1f3f9;
    border-radius: 20px;
    padding: 5px 15px;
    transition: all 0.2s ease;
  }

  .search-input-group:hover,
  .search-input-group:focus-within {
    background-color: white;
    box-shadow: 0 0 0 2px #3b5bdb;
  }

  #search-input {
    flex: 1;
    border: none;
    padding: 8px;
    font-size: 14px;
    color: #495057;
    cursor: pointer;
    background-color: transparent;
  }

  #search-input:focus {
    outline: none;
  }

  #search-button {
    border: none;
    background: none;
    color: #3b5bdb;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  #search-button:hover {
    color: #364fc7;
  }

  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 768px) {
    .header {
      padding: 10px;
    }

    .nav-links {
      gap: 10px;
    }

    .auth-buttons button {
      padding: 6px 12px;
    }

    .search-container {
      max-width: 200px;
      margin: 0 10px;
    }
  }
</style>

<div class="header">
  <div class="logo">
    <a href="${pageContext.request.contextPath}/">MapDiary</a>
  </div>

  <div class="search-container">
    <div class="search-input-group">
      <input type="text" id="search-input" placeholder="주소를 검색하세요" readonly>
      <button id="search-button">
        <i class="bi bi-search"></i>
      </button>
    </div>
  </div>

  <div class="auth-buttons">
    <span id="username" style="display: none;"></span>
    <button id="login_btn" style="display: none;" onclick="location.href='${pageContext.request.contextPath}/login.do'">로그인</button>
    <button id="signup_btn" style="display: none;" onclick="location.href='${pageContext.request.contextPath}/signup.do'">회원가입</button>
    <button id="logout_btn" style="display: none;">로그아웃</button>
  </div>
</div>