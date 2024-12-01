package mapdiary.Board.service.impl;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import mapdiary.Board.service.SharedLocationVO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("sharedLocationDAO")
public class SharedLocationDAO extends EgovAbstractMapper {

    public List<Map<String, Object>> selectSharedLocationsList(Long userId) {
        try {
            return selectList("SharedLocation.selectSharedLocationsList", userId);  // namespace.id 확인
        } catch (Exception e) {
            e.printStackTrace(); // 로그 확인을 위해
            throw new RuntimeException("데이터베이스 조회 중 오류가 발생했습니다.", e);
        }
    }

    public void insertSharedLocation(SharedLocationVO vo){
        insert("SharedLocation.insertSharedLocation", vo);
    }

    public Integer getSharedIdByLocationAndUser(int locationId, Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("locationId", locationId);
        params.put("userId", userId);
        return selectOne("SharedLocation.getSharedIdByLocationAndUser", params);
    }

    public void deleteLikesBySharedId(int sharedId) {
        delete("SharedLocation.deleteLikesBySharedId", sharedId);
    }

    public void deleteSharedLocation(int locationId, Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("locationId", locationId);
        params.put("userId", userId);
        delete("SharedLocation.deleteSharedLocation", params);
    }

    void insertLike(int sharedId, Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("sharedId", sharedId);
        params.put("userId", userId);
        insert("SharedLocation.insertLike", params);
    }

    void deleteLike(int sharedId, Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("sharedId", sharedId);
        params.put("userId", userId);
        delete("SharedLocation.deleteLike", params);
    }

    void updateLikeCount(int sharedId) {
        update("SharedLocation.updateLikeCount", sharedId);
    }

    public int getLikeCount(int locationId) {
        Integer sharedId = selectOne("SharedLocation.getSharedIdByLocationId", locationId);
        if (sharedId == null) {
            return 0;
        }
        return selectOne("SharedLocation.getLikeCount", sharedId);
    }

    public List<Map<String, Object>> selectHotLocationsList() {
        return selectList("SharedLocation.selectHotLocationsList");
    }

    public List<Integer> selectHotLocationIds() {
        return selectList("SharedLocation.selectHotLocationIds");
    }

    // 요청 객체 클래스
    public static class SharedLocationDeleteRequest {
        private int locationId;
        private int sharedUserId;

        public SharedLocationDeleteRequest(int locationId, int sharedUserId) {
            this.locationId = locationId;
            this.sharedUserId = sharedUserId;
        }

        // Getters and Setters
        public int getLocationId() {
            return locationId;
        }

        public void setLocationId(int locationId) {
            this.locationId = locationId;
        }

        public int getSharedUserId() {
            return sharedUserId;
        }

        public void setSharedUserId(int sharedUserId) {
            this.sharedUserId = sharedUserId;
        }
    }
}
