package mapdiary.user.web;

import mapdiary.user.service.UserService;
import mapdiary.user.service.UserVO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

@Controller
public class UserController {

    @Resource(name = "userService")
    private UserService userService;

    // 로그인
    @RequestMapping("/login.do")
    @ResponseBody
    public String login(@RequestBody UserVO userVO, HttpSession session) {
        UserVO user = userService.memberCheck(userVO);
        if (user != null) {
            session.setAttribute("user", user); // 세션에 사용자 정보 저장
            return "로그인 성공"; // 성공 메시지 반환
        } else {
            return "로그인 실패: 사용자 이름 또는 비밀번호가 잘못되었습니다."; // 실패 메시지 반환
        }
    }

    // 회원가입
    @RequestMapping("/signup.do")
    @ResponseBody
    public String signup(@RequestBody UserVO userVO) {
        try {
            return userService.signupUser(userVO); // 회원가입 메서드 호출
        } catch (Exception e) {
            e.printStackTrace();
            return "회원가입 중 오류가 발생했습니다."; // 오류 메시지 반환
        }
    }

    // 로그아웃
    @RequestMapping("/logout.do")
    @ResponseBody
    public String logout(HttpSession session) {
        session.invalidate(); // 세션 무효화
        return "로그아웃 성공"; // 로그아웃 메시지 반환
    }
}