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

    // 좋아요 버튼 클릭 이벤트
    $(document).on('click', '.like-button', function() {
        const $button = $(this);
        const sharedId = $button.attr('data-shared-id');
        const isLiked = $button.data('liked') === true;

        console.log('Request sending:', {
            sharedId: sharedId,
            action: isLiked ? 'unlike' : 'like'
        });

        $.ajax({
            url: contextPath + '/like.do',
            type: 'POST',
            data: {
                sharedId: sharedId,
                action: isLiked ? 'unlike' : 'like'
            },
            dataType: 'json',  // 응답 형식을 JSON으로 명시
            success: function(response) {
                console.log('Server response:', response);  // 응답 확인

                if (response && response.success) {  // response 객체 존재 여부 확인
                    // 하트 아이콘 토글
                    $button.toggleClass('bi-heart bi-heart-fill');
                    // liked 상태 토글
                    $button.data('liked', !isLiked);

                    // 좋아요 수 업데이트
                    const $likeCount = $button.siblings('.like-count');
                    const currentCount = parseInt($likeCount.text());
                    $likeCount.text(isLiked ? currentCount - 1 : currentCount + 1);
                } else {
                    console.error('Invalid response:', response);
                    alert(response?.message || '좋아요 처리 중 오류가 발생했습니다.');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', {
                    status: status,
                    error: error,
                    response: xhr.responseText,
                    xhr: xhr
                });
                alert('서버 통신 중 오류가 발생했습니다.');
            }
        });
    });
});