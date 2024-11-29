package mapdiary.Board.service;

public interface SharedLocationService {
    void saveSharedLocation(SharedLocationVO sharedLocation);
    void deleteSharedLocation(int locationId, int sharedUserId);
}
