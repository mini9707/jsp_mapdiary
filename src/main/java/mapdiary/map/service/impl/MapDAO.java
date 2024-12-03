package mapdiary.map.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import mapdiary.map.service.LocationVO;

@Repository("mapDAO")
public class MapDAO extends EgovAbstractMapper {
    public void insertLocation(LocationVO vo) throws Exception {
        insert("Map.insertLocation", vo);
    }

    public List<LocationVO> selectLocationList(LocationVO vo) throws Exception {
        return selectList("Map.selectLocationList", vo);
    }

    public void updateSharedStatus(Map<String, Object> data) {
        update("Map.updateSharedStatus",data);
    }
}