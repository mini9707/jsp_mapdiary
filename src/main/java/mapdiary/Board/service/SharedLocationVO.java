package mapdiary.Board.service;

import java.time.LocalDateTime;

public class SharedLocationVO {
    private static final long serialVersionUID = 1L; // 추가

    private int sharedId;        // 공유 ID
    private int locationId;      // 공유된 장소의 ID
    private int sharedUserId;    // 공유한 사용자의 ID
    private int like_count;    // 추가된 필드
    private LocalDateTime sharedAt; // 공유된 날짜 및 시간


    public int getSharedId() { return sharedId; }
    public void setSharedId(int sharedId) { this.sharedId = sharedId; }

    public int getLocationId() { return locationId; }
    public void setLocationId(int locationId) { this.locationId = locationId; }

    public int getSharedUserId() { return sharedUserId; }
    public void setSharedUserId(int sharedUserId) { this.sharedUserId = sharedUserId; }

    public int getLike_count() { return like_count; }
    public void setLike_count(int like_count) { this.like_count = like_count; }

    public LocalDateTime getSharedAt() { return sharedAt; }
    public void setSharedAt(LocalDateTime sharedAt) { this.sharedAt = sharedAt; }
}
