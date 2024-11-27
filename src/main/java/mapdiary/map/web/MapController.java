package mapdiary.map.web;

import mapdiary.map.service.LocationVO;
import mapdiary.map.service.MapService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

@Controller
public class MapController {

    @Resource(name = "mapService")
    private MapService mapService;

    @RequestMapping("/test.do")
    public String test(Model model) {
        return "mapMain";
    }

    @RequestMapping(value = "/map/insertLocation.do")
    @ResponseBody
    public LocationVO insertLocation(@RequestBody LocationVO locationVO)
            throws Exception {
        return mapService.insertLocation(locationVO);
    }

    @RequestMapping(value = "/map/selectLocationList.do")
    @ResponseBody
    public List<LocationVO> selectLocationList(LocationVO searchVO)
            throws Exception {
        return mapService.selectLocationList(searchVO);
    }
}