package mapdiary.map.service;

public class LocationVO {
    private Long locationId;
    private Long userId;
    private String locationNm;
    private String locationDesc;
    private double locationX;
    private double locationY;
    private boolean isShared;

    public Long getLocationId() {
        return locationId;
    }
    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getLocationNm() {
        return locationNm;
    }
    public void setLocationNm(String locationNm) {
        this.locationNm = locationNm;
    }

    public String getLocationDesc() { return locationDesc; }
    public void setLocationDesc(String locationDesc) { this.locationDesc = locationDesc; }

    public double getLocationX() {
        return locationX;
    }
    public void setLocationX(double locationX) {
        this.locationX = locationX;
    }

    public double getLocationY() {
        return locationY;
    }
    public void setLocationY(double locationY) {
        this.locationY = locationY;
    }

    public boolean getIsShared() { return isShared; }
    public void setIsShared(boolean isShared) { this.isShared = isShared; }
}