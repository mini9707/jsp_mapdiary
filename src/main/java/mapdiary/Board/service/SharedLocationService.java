package mapdiary.Board.service;

import java.util.List;
import java.util.Map;

public interface SharedLocationService {
    void saveSharedLocation(SharedLocationVO sharedLocation);
    void deleteSharedLocation(int locationId, int sharedUserId);
    List<Map<String, Object>> getSharedLocations();
}
