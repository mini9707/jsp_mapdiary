package mapdiary.user.service;

public interface UserService {
    String signupUser(UserVO userVO) throws Exception;
    UserVO memberCheck(UserVO userVO);
}
