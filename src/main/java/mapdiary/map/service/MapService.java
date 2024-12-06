package mapdiary.map.service;

import java.util.List;

public interface MapService {
    LocationVO insertLocation(LocationVO vo) throws Exception;
    List<LocationVO> selectLocationList(LocationVO vo) throws Exception;
    void updateSharedStatus(Long locationId, boolean isShared);
    void deleteLocation(Long locationId) throws Exception;
}