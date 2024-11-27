package mapdiary.user.service;

public interface UserService {
    String signupUser(UserVO userVO) throws Exception;
    UserVO memberCheck(UserVO userVO); // 사용자 정보를 반환하도록 수정
}
