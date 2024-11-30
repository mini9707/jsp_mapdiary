$(document).ready(function() {
    // 사용자 인증 상태 처리
    if (username) {
        $('#username').text(username + '님').show();
        $('#logout_btn').show();
        $('#login_btn').hide();
        $('#signup_btn').hide();
    } else {
        $('#login_btn').show();
        $('#signup_btn').show();
        $('#logout_btn').hide();
        $('#username').hide();
    }

    // 로그아웃 버튼 클릭 이벤트
    $('#logout_btn').click(function() {
        $.ajax({
            url: contextPath + "/logout.do",
            type: "POST",
            success: function(response) {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error('로그아웃 실패:', error);
                alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    });

    // 장소 카드 클릭 이벤트 (필요한 경우)
    $('.location-card').click(function() {
        // 장소 카드 클릭 시 상세 정보 보기 등의 기능 구현
        const locationId = $(this).data('location-id');
        // 추가 기능 구현
    });
});