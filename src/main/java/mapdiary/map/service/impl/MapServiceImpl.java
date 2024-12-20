package mapdiary.map.service.impl;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import mapdiary.map.service.LocationVO;
import mapdiary.map.service.MapService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("mapService")
public class MapServiceImpl extends EgovAbstractServiceImpl implements MapService {

    @Resource(name="mapDAO")
    private MapDAO mapDAO;

    @Override
    public LocationVO insertLocation(LocationVO vo) throws Exception {
        mapDAO.insertLocation(vo);
        return vo;
    }

    @Override
    public List<LocationVO> selectLocationList(LocationVO vo) throws Exception {
        return mapDAO.selectLocationList(vo);
    }

    public void updateSharedStatus(Long locationId, boolean isShared) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("locationId", locationId);
            data.put("isShared", isShared);

            mapDAO.updateSharedStatus( data);
        } catch (Exception e) {
            throw new RuntimeException("is_shared 상태 업데이트 중 오류 발생", e);
        }
    }

    @Override
    public void deleteLocation(Long locationId) throws Exception {
        mapDAO.deleteLocation(locationId);
    }
}