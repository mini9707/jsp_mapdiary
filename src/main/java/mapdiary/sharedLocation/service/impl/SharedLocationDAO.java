package mapdiary.sharedLocation.service.impl;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import mapdiary.sharedLocation.service.SharedLocationVO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("sharedLocationDAO")
public class SharedLocationDAO extends EgovAbstractMapper {
    // 공유된 장소 목록 조회
    public List<Map<String, Object>> selectSharedLocationsList(Long userId) {
        return selectList("SharedLocation.selectSharedLocationsList", userId);
    }

    // 공유된 장소 저장
    public void insertSharedLocation(SharedLocationVO vo) {
        insert("SharedLocation.insertSharedLocation", vo);
    }

    // 공유된 장소 삭제
    public void deleteSharedLocation(int locationId, Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("locationId", locationId);
        params.put("userId", userId);
        delete("SharedLocation.deleteSharedLocation", params);
    }

    // 좋아요 추가
    public void insertLike(int sharedId, Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("sharedId", sharedId);
        params.put("userId", userId);
        insert("SharedLocation.insertLike", params);
    }

    // 좋아요 제거
    public void deleteLike(int sharedId, Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("sharedId", sharedId);
        params.put("userId", userId);
        delete("SharedLocation.deleteLike", params);
    }

    // 좋아요 수 업데이트
    public void updateLikeCount(int sharedId) {
        update("SharedLocation.updateLikeCount", sharedId);
    }

    // 좋아요 수 조회
    public int getLikeCount(int locationId) {
        Integer sharedId = selectOne("SharedLocation.getSharedIdByLocationId", locationId);
        return sharedId != null ? selectOne("SharedLocation.getLikeCount", sharedId) : 0;
    }

    // 인기 장소 목록 조회
    public List<Map<String, Object>> selectHotLocationsList() {
        return selectList("SharedLocation.selectHotLocationsList");
    }

    // 인기 장소 ID 목록 조회
    public List<Integer> selectHotLocationIds() {
        return selectList("SharedLocation.selectHotLocationIds");
    }
}
