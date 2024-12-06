$(document).ready(function () {
    $('#signupForm').submit(function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();
        const email = $('#email').val();

        if (!username.trim()) {
            util.alert("warning", "입력 오류", "사용자 이름을 입력해주세요.");
            return;
        }
        if (!password.trim()) {
            util.alert("warning", "입력 오류", "비밀번호를 입력해주세요.");
            return;
        }
        if (!email.trim()) {
            util.alert("warning", "입력 오류", "이메일을 입력해주세요.");
            return;
        }

        $.ajax({
            url: contextPath + "/signup.do",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                password: password,
                email: email
            }),
            success: function (response) {
                if (response === "success") {
                    util.alert("success", "회원가입 성공", "회원가입이 완료되었습니다<br>로그인을 해주세요", function () {
                        window.location.href = contextPath + "/login.do";
                    });
                } else {
                    util.alert("error", "회원가입 실패", response);
                }
            },
            error: function (xhr) {
                let errorMessage = "회원가입 중 오류가 발생했습니다";
                if (xhr.responseText) {
                    errorMessage = xhr.responseText;
                }
                util.alert("error", "회원가입 실패", errorMessage);
            }
        });
    });
});