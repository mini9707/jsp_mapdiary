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
    public String signupUser(UserVO userVO) throws Exception {

        if (userDAO.checkUsername(userVO.getUsername()) != null) {
            return "이미 사용 중인 사용자 이름입니다.";
        }

        if (userDAO.checkEmail(userVO.getEmail()) != null) {
            return "이미 사용 중인 이메일입니다.";
        }

        userDAO.insertUser(userVO);
        return "회원가입이 완료되었습니다.";
    }

    @Override
    public UserVO memberCheck(UserVO userVO) {
        return userDAO.selectOne(userVO);
    }
}