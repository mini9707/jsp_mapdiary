package mapdiary.map.service.impl;

import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import mapdiary.map.service.MapService;
import mapdiary.map.service.LocationVO;

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
}