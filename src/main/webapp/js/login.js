$(document).ready(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            url: contextPath + "/login.do",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: username, password: password }),
            success: function (response) {
                alert(username+"님 환영합니다");
                window.location.href = contextPath + "/" ;
            },
            error: function (error) {
                alert("로그인 실패: 사용자 이름 또는 비밀번호가 잘못되었습니다.");
            }
        });
    });
});