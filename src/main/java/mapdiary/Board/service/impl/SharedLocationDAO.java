package mapdiary.Board.service.impl;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import mapdiary.Board.service.SharedLocationVO;
import org.springframework.stereotype.Repository;

@Repository("sharedLocationDAO")
public class SharedLocationDAO extends EgovAbstractMapper {

    public void insertSharedLocation(SharedLocationVO vo){
        insert("SharedLocation.insertSharedLocation", vo);
    }

    void deleteSharedLocation(int locationId, int sharedUserId){
        delete("SharedLocation.deleteSharedLocation", new SharedLocationDeleteRequest(locationId, sharedUserId));
    }

    // 요청 객체 클래스
    public static class SharedLocationDeleteRequest {
        private int locationId;
        private int sharedUserId;

        public SharedLocationDeleteRequest(int locationId, int sharedUserId) {
            this.locationId = locationId;
            this.sharedUserId = sharedUserId;
        }

        // Getters and Setters
        public int getLocationId() {
            return locationId;
        }

        public void setLocationId(int locationId) {
            this.locationId = locationId;
        }

        public int getSharedUserId() {
            return sharedUserId;
        }

        public void setSharedUserId(int sharedUserId) {
            this.sharedUserId = sharedUserId;
        }
    }
}
