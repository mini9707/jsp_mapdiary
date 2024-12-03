package mapdiary.sharedLocation.service;

import java.util.List;
import java.util.Map;

public interface SharedLocationService {
    // 공유된 장소 목록 조회
    List<Map<String, Object>> getSharedLocations(Long userId);

    // 장소 공유 저장
    void saveSharedLocation(SharedLocationVO sharedLocation);

    // 장소 공유 삭제
    void deleteSharedLocation(int locationId, Long sharedUserId);

    // 좋아요 추가
    boolean addLike(int sharedId, Long userId);

    // 좋아요 제거
    boolean removeLike(int sharedId, Long userId);

    // 좋아요 수 조회
    int getLikeCount(int locationId);

    // 인기 장소 목록 조회 (좋아요 5개 이상)
    List<Map<String, Object>> getHotLocations();

    // 인기 장소 ID 목록 조회
    List<Integer> getHotLocationIds();
}
