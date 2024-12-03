package mapdiary.sharedLocation.service;

import java.time.LocalDateTime;

public class SharedLocationVO {
    private int sharedId;
    private int locationId;
    private int sharedUserId;
    private int like_count;
    private LocalDateTime sharedAt;


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
