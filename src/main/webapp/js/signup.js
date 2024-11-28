$(document).ready(function () {
    $('#signupForm').submit(function (e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const username = $('#username').val();
        const password = $('#password').val();
        const email = $('#email').val();

        $.ajax({
            url: contextPath + "/signup.do",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: username, password: password, email: email }),
            success: function (response) {
                alert(response); // 회원가입 성공 메시지
                // 회원가입 후 로그인 페이지로 리다이렉트
                window.location.href = contextPath + "/login.jsp";
            },
            error: function (error) {
                alert("회원가입 중 오류가 발생했습니다.");
            }
        });
    });
});