$(document).ready(function () {
    $('#signupForm').submit(function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();
        const email = $('#email').val();

        $.ajax({
            url: contextPath + "/signup.do",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: username, password: password, email: email }),
            success: function (response) {
                alert("회원가입이 완료되었습니다");
                window.location.href = contextPath + "/login.do";
            },
            error: function (error) {
                alert("회원가입 중 오류가 발생했습니다");
            }
        });
    });
});