var util = {
    /**
     * 알림창 sweetalert2
     * parameter: (필수) icon     => 'info', 'success', 'error', 'warning', 'question'
     *            (필수) title    => 알림 내용
     *            (선택) text     => 알림 세부 내용 (없는 경우 비우거나 undefined)
     *            (선택) confirmCallback => 확인 이후 진행할 function (없는 경우 비우거나 undefined)
     *            (선택) cancelCallback  => 취소 이후 진행할 function (없는 경우 비우거나 undefined)
     */
    alert: function(icon, title, text, confirmCallback, cancelCallback) {
        return Swal.fire({
            icon: icon,
            title: title,
            html: text ? text.replace(/\n/g, '<br>') : '', // text가 있을 때만 replace 실행
            showConfirmButton: true,
            confirmButtonColor: "#3085D6",
            confirmButtonText: "확인",
            showCancelButton: icon == 'question',
            cancelButtonColor: "#DD3333",
            cancelButtonText: "취소",
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                container: 'custom-alert-container'
            },
            returnFocus: false
        }).then((result) => {
            if (result.isConfirmed) {
                if(confirmCallback !== undefined) confirmCallback();
                return true;
            } else if (result.isDismissed) {
                if(cancelCallback !== undefined) cancelCallback();
                return false;
            }
        });
    }
};