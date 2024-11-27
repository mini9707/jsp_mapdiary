<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MapDiary</title>

    <!-- index.css 파일을 JSP 파일에 연결 -->
    <link rel="stylesheet" href="<c:url value='/css/index.css' />" type="text/css">
</head>
<body>
<div id="webcrumbs">
    <div class="w-[900px] bg-white shadow rounded-lg">
        <header class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center space-x-4">
                <div class="w-[30px] h-[30px] bg-neutral-900 rounded-md flex items-center justify-center text-neutral-50">
                    <span class="material-symbols-outlined">menu</span>
                </div>
                <h1 class="text-neutral-900 font-title text-lg">MapDiary</h1>
            </div>
            <nav class="flex items-center space-x-6">
                <a href="#" class="text-neutral-900 hover:text-primary-700">
                    Community
                </a>
                <a href="#" class="text-neutral-900 hover:text-primary-700">
                    My Place
                </a>
                <a href="#" class="text-neutral-900 hover:text-primary-700">
                    __?
                </a>
            </nav>
            <div class="flex items-center space-x-4">
                <button class="w-[80px] h-[40px] bg-primary-800 text-primary-50 rounded-md">
                    Sign In
                </button>
                <button class="w-[90px] h-[40px] bg-primary-100 text-primary-800 rounded-md">
                    Register
                </button>
            </div>
        </header>

        <!-- 본문 내용 -->
        <div class="px-4 py-4">
            <div class="w-full h-[calc(100vh-80px)] bg-neutral-200 rounded-lg" style="margin: 10px;"></div>
        </div>
    </div>
</div>
</body>
</html>
