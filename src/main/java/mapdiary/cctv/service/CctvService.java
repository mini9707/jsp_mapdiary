package mapdiary.cctv.service;

import egovframework.rte.fdl.cmmn.exception.FdlException;

import java.io.IOException;
import java.util.List;

public interface CctvService {
    int insertCctv() throws IOException;

    CctvVO getCctvInfo(int id);

    List<CctvVO> getCctvList();

}
