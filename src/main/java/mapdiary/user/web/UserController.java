package mapdiary.user.web;

import mapdiary.user.service.UserService;
import mapdiary.user.service.UserVO;
import org.springframework.http.HttpStatus;
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

    // 로그인 페이지로 이동
    @RequestMapping(value = "/login.do")
    public String showLoginPage() {
        return "login";
    }

    // 회원가입 페이지로 이동
    @RequestMapping(value = "/signup.do")
    public String showSignupPage() {
        return "signup";
    }

    // 로그인 로직
    @RequestMapping(value = "/login.do", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody UserVO userVO, HttpSession session) {
        try {
            UserVO user = userService.memberCheck(userVO);
            if (user != null) {
                session.setAttribute("user", user);
                return ResponseEntity.ok().body("success");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    // 회원가입 로직
    @RequestMapping(value = "/signup.do", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> signup(@RequestBody UserVO userVO) {
        try {
            String result = userService.signupUser(userVO);
            if (result.equals("회원가입이 완료되었습니다.")) {
                return ResponseEntity.ok().body("success");
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원가입 처리 중 오류가 발생했습니다.");
        }
    }

    // 로그아웃 로직
    @RequestMapping(value = "/logout.do", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok("로그아웃 성공");
    }
}