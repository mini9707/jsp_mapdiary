package mapdiary.Board.service;

import java.util.List;
import java.util.Map;

public interface SharedLocationService {
    void saveSharedLocation(SharedLocationVO sharedLocation);
    void deleteSharedLocation(int locationId, Long sharedUserId);
    List<Map<String, Object>> getSharedLocations(Long userId);
    boolean addLike(int sharedId, Long userId);
    boolean removeLike(int sharedId, Long userId);
    int getLikeCount(int locationId);
    List<Map<String, Object>> getHotLocations();
    List<Integer> getHotLocationIds();
}
