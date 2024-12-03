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
    public String login(@RequestBody UserVO userVO, HttpSession session) {
        UserVO user = userService.memberCheck(userVO);
        if (user != null) {
            session.setAttribute("user", user);
            return "success";
        } else {
            return "redirect:/login.jsp?error=true";
        }
    }

    // 회원가입 로직
    @RequestMapping(value = "/signup.do", method = RequestMethod.POST)
    @ResponseBody
    public String signup(@RequestBody UserVO userVO) {
        try {
            userService.signupUser(userVO);
            return "redirect:/login.jsp";
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/signup.jsp?error=true";
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