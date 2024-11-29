package mapdiary.user.service.impl;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import mapdiary.user.service.UserVO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("userDAO")
public class UserDAO extends EgovAbstractMapper {

    public void insertUser(UserVO userVO) {
        insert("User.insertUser", userVO);
    }

    public UserVO checkUsername(String username) {
        return selectOne("User.checkUsername", username);
    }

    public UserVO checkEmail(String email) {
        return selectOne("User.checkEmail", email);
    }

    public UserVO selectOne(UserVO userVO) {
        return selectOne("User.selectOne", userVO);
    }
}