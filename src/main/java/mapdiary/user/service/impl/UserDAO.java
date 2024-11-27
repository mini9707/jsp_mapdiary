package mapdiary.user.service.impl;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import mapdiary.user.service.UserVO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("userDAO")
public class UserDAO extends EgovAbstractMapper {

    public void insertUser(UserVO userVO) {
        insert("User.insertUser", userVO); // MyBatis 매핑 ID 사용
    }

    public UserVO checkUsername(String username) {
        return selectOne("User.checkUsername", username); // 사용자 이름 중복 체크
    }

    public UserVO checkEmail(String email) {
        return selectOne("User.checkEmail", email); // 이메일 중복 체크
    }

    public UserVO selectOne(UserVO userVO) {
        return selectOne("User.selectOne", userVO); // 사용자 정보 조회
    }
}