package mapdiary.map.service;

public class LocationVO {
    private static final long serialVersionUID = 1L;

    private Long locationId;
    private String locationNm;
    private double locationX;
    private double locationY;

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getLocationNm() {
        return locationNm;
    }

    public void setLocationNm(String locationNm) {
        this.locationNm = locationNm;
    }

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
}