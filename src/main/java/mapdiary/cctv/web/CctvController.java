package mapdiary.cctv.web;

import mapdiary.cctv.service.CctvService;
import mapdiary.cctv.service.CctvVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.List;

@RestController
public class CctvController {
    @Resource(name = "CctvService")
    private CctvService service;

    // 1. cctv insert 테스트 || 직접 insert
    @PostMapping("updateCctv.do")
    public int insertCctv() throws IOException {
        return service.insertCctv();
    }

    // 2. get cctv data list
    @GetMapping("getCctvList.do")
    public List<CctvVO> getCctvList() {
        return service.getCctvList();
    }

    // @GetMapping("getCctv.do")
    // public CctvVO getCctvInfo(@RequestParam int id) {
    //     return service.getCctvInfo(id);
    // }
}
