package mapdiary.user.web;

import mapdiary.user.service.UserService;
import mapdiary.user.service.UserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class UserController {

    @Resource(name = "userService")
    private UserService userService;

    @RequestMapping(value = "/login.do", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestBody UserVO userVO, HttpSession session) {
        UserVO user = userService.memberCheck(userVO);
        if (user != null) {
            session.setAttribute("user", user); // 세션에 사용자 정보 저장
            return "success"; // 로그인 성공 후 메인 페이지로 리다이렉트
        } else {
            return "redirect:/login.jsp?error=true"; // 로그인 실패 시 로그인 페이지로 리다이렉트
        }
    }

    @RequestMapping(value = "/signup.do", method = RequestMethod.POST)
    @ResponseBody
    public String signup(@RequestBody UserVO userVO) {
        try {
            userService.signupUser(userVO); // 회원가입 메서드 호출
            return "redirect:/login.jsp"; // 회원가입 후 로그인 페이지로 리다이렉트
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/signup.jsp?error=true"; // 오류 발생 시 회원가입 페이지로 리다이렉트
        }
    }

    @RequestMapping(value = "/logout.do", method = RequestMethod.POST)
    @ResponseBody // AJAX 요청에 대한 응답을 JSON 형식으로 반환
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // 현재 세션을 가져옵니다.

        if (session != null) {
            session.invalidate(); // 세션 무효화
        }

        return ResponseEntity.ok("로그아웃 성공"); // 성공 메시지 반환
    }

    @RequestMapping(value = "/login.do", method = RequestMethod.GET)
    public String showLoginPage() {
        return "login"; // 로그인 페이지로 이동
    }

    @RequestMapping(value = "/signup.do", method = RequestMethod.GET)
    public String showSignupPage() {
        return "signup"; // 회원가입 페이지로 이동
    }
}