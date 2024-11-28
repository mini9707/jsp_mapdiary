<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="<c:url value='/css/index.css'/>" type="text/css">
    <title>My Webcrumbs Plugin</title>
</head>
<body>
<div id="webcrumbs">
    <div className="w-[1200px] bg-white shadow-lg rounded-lg">
        <header className="flex items-center justify-between px-6 py-4">
            <div className="text-primary-950 font-title text-lg">mapdiary</div>
            <nav className="flex items-center gap-6">
                <a href="#community" className="text-neutral-950 hover:text-primary-500">Community</a>
                <a href="#myplace" className="text-neutral-950 hover:text-primary-500">Myplace</a>
            </nav>
            <div className="flex gap-4">
                <button className="px-5 py-2 bg-primary-500 text-primary-50 rounded-md">로그인</button>
                <button className="px-5 py-2 bg-neutral-500 text-neutral-50 rounded-md">회원가입</button>
            </div>
        </header>
        <div className="flex justify-between px-6 py-2 items-center">
            <button className="px-4 py-2 bg-red-500 text-primary-50 rounded-md">HOT</button>
            <div className="flex gap-4">
                <button className="px-4 py-2 bg-green-500 text-primary-50 rounded-md">교통레이어</button>
                <button className="px-4 py-2 bg-green-500 text-primary-50 rounded-md">CCTV 레이어</button>
            </div>
        </div>
        <div className="w-full h-[600px] bg-neutral-200 rounded-lg mt-4">
            {/* Map will be added here */}
        </div>
    </div>
</div>
</body>
</html>