package mapdiary.cctv.service.impl;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import mapdiary.cctv.service.CctvVO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("CctvDAO")
public class CctvDAO extends EgovAbstractMapper {
    public void delteCctv(){
        delete("CctvDAO.delteCctv");
    }

    public int insertCctv(List<CctvVO> data) {
        return insert("CctvDAO.insertCctv", data);
    }

    public CctvVO getCctvInfo(int id) {
        return selectOne("CctvDAO.getCctvInfo", id);
    }

    public List<CctvVO> getCctvList() {
        return selectList("CctvDAO.getCctvList");
    }
}
