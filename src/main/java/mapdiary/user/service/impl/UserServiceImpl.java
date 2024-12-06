package mapdiary.user.service.impl;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import mapdiary.user.service.UserService;
import mapdiary.user.service.UserVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service("userService")
public class UserServiceImpl extends EgovAbstractServiceImpl implements UserService {
    @Resource(name = "userDAO")
    private UserDAO userDAO;

    @Override
    public UserVO memberCheck(UserVO userVO) {
        try {
            return userDAO.selectOne(userVO);
        } catch (Exception e) {
            egovLogger.error("로그인 처리 중 오류 발생", e);
            return null;
        }
    }

    @Override
    public String signupUser(UserVO userVO) throws Exception {
        if (userVO.getUsername() == null || userVO.getUsername().trim().isEmpty()) {
            return "사용자 이름을 입력해주세요.";
        }
        if (userVO.getPassword() == null || userVO.getPassword().trim().isEmpty()) {
            return "비밀번호를 입력해주세요.";
        }
        if (userVO.getEmail() == null || userVO.getEmail().trim().isEmpty()) {
            return "이메일을 입력해주세요.";
        }

        if (userDAO.checkUsername(userVO.getUsername()) != null) {
            return "이미 사용 중인 사용자 이름입니다.";
        }
        if (userDAO.checkEmail(userVO.getEmail()) != null) {
            return "이미 사용 중인 이메일입니다.";
        }

        userDAO.insertUser(userVO);
        return "회원가입이 완료되었습니다.";
    }


}