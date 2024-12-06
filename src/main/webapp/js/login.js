$(document).ready(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        if (!username.trim()) {
            util.alert("warning", "입력 오류", "사용자 이름을 입력해주세요.");
            return;
        }
        if (!password.trim()) {
            util.alert("warning", "입력 오류", "비밀번호를 입력해주세요.");
            return;
        }

        $.ajax({
            url: contextPath + "/login.do",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function (response) {
                if (response === "success") {
                    util.alert("success", "로그인 성공", username + "님 환영합니다", function () {
                        window.location.href = contextPath + "/";
                    });
                } else {
                    util.alert("error", "로그인 실패", response);
                }
            },
            error: function (xhr) {
                let errorMessage = "로그인 중 오류가 발생했습니다";
                if (xhr.responseText) {
                    errorMessage = xhr.responseText;
                }
                util.alert("error", "로그인 실패", errorMessage);
            }
        });
    });
});