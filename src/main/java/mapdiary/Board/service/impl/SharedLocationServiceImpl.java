package mapdiary.Board.service.impl;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import mapdiary.Board.service.SharedLocationService;
import mapdiary.Board.service.SharedLocationVO;
import mapdiary.user.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service("sharedLocationService")
public class SharedLocationServiceImpl extends EgovAbstractServiceImpl implements SharedLocationService {

    @Resource(name = "sharedLocationDAO")
    private SharedLocationDAO sharedLocationDAO;

    public List<Map<String, Object>> getSharedLocations() {
        try {
            return sharedLocationDAO.selectSharedLocationsList();
        } catch (Exception e) {
            e.printStackTrace(); // 로그 확인을 위해
            throw new RuntimeException("공유된 위치 정보를 가져오는데 실패했습니다.", e);
        }
    }


    public void saveSharedLocation(SharedLocationVO sharedLocation) {
        try {
            sharedLocationDAO.insertSharedLocation(sharedLocation);
        } catch (Exception e) {
            throw new RuntimeException("장소 공유 중 오류 발생", e);
        }
    }

    public void deleteSharedLocation(int locationId, int sharedUserId) {
        try {
            sharedLocationDAO.deleteSharedLocation(locationId, sharedUserId);
        } catch (Exception e) {
            throw new RuntimeException("장소 공유 취소 중 오류 발생", e);
        }
    }
}
