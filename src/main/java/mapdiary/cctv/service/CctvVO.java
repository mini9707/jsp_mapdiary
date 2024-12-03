package mapdiary.cctv.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class CctvVO {
    private int cctvId;
    private String name;
    private Double coorx;
    private Double coory;
    private String url;

    public int getCctvId() {
        return cctvId;
    }

    public void setCctvId(int cctvId) {
        this.cctvId = cctvId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getCoorx() {
        return coorx;
    }

    public void setCoorx(Double coorx) {
        this.coorx = coorx;
    }

    public Double getCoory() {
        return coory;
    }

    public void setCoory(Double coory) {
        this.coory = coory;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
