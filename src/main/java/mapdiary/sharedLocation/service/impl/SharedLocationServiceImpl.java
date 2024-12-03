package mapdiary.sharedLocation.service.impl;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import mapdiary.sharedLocation.service.SharedLocationService;
import mapdiary.sharedLocation.service.SharedLocationVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@Service("sharedLocationService")
public class SharedLocationServiceImpl extends EgovAbstractServiceImpl implements SharedLocationService {
    @Resource(name = "sharedLocationDAO")
    private SharedLocationDAO sharedLocationDAO;

    @Override
    public List<Map<String, Object>> getSharedLocations(Long userId) {
        try {
            return sharedLocationDAO.selectSharedLocationsList(userId);
        } catch (Exception e) {
            throw new RuntimeException("공유된 위치 정보 조회 실패", e);
        }
    }

    @Override
    public void saveSharedLocation(SharedLocationVO sharedLocation) {
        try {
            sharedLocationDAO.insertSharedLocation(sharedLocation);
        } catch (Exception e) {
            throw new RuntimeException("장소 공유 저장 실패", e);
        }
    }

    @Override
    public void deleteSharedLocation(int locationId, Long sharedUserId) {
        try {
            sharedLocationDAO.deleteSharedLocation(locationId, sharedUserId);
        } catch (Exception e) {
            throw new RuntimeException("장소 공유 삭제 실패", e);
        }
    }

    @Override
    @Transactional
    public boolean addLike(int sharedId, Long userId) {
        try {
            sharedLocationDAO.insertLike(sharedId, userId);
            sharedLocationDAO.updateLikeCount(sharedId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Transactional
    public boolean removeLike(int sharedId, Long userId) {
        try {
            sharedLocationDAO.deleteLike(sharedId, userId);
            sharedLocationDAO.updateLikeCount(sharedId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public int getLikeCount(int locationId) {
        return sharedLocationDAO.getLikeCount(locationId);
    }

    @Override
    public List<Map<String, Object>> getHotLocations() {
        return sharedLocationDAO.selectHotLocationsList();
    }

    @Override
    public List<Integer> getHotLocationIds() {
        return sharedLocationDAO.selectHotLocationIds();
    }
}
