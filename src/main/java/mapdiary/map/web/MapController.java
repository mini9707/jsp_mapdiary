package mapdiary.map.web;

import mapdiary.map.service.LocationVO;
import mapdiary.map.service.MapService;
import mapdiary.user.service.UserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

@Controller
public class MapController {

    @Resource(name = "mapService")
    private MapService mapService;

    // 위치 정보 저장
    @RequestMapping(value = "/map/insertLocation.do")
    @ResponseBody
    public LocationVO insertLocation(@RequestBody LocationVO locationVO, HttpServletRequest request) throws Exception {
        UserVO user = (UserVO) request.getSession().getAttribute("user");
        if (user != null) {
            locationVO.setUserId(user.getId());
        }
        return mapService.insertLocation(locationVO);
    }

    // 위치 정보 삭제
    @RequestMapping(value = "/map/deleteLocation.do", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> deleteLocation(@RequestBody LocationVO locationVO) {
        try {
            mapService.deleteLocation(locationVO.getLocationId());
            return ResponseEntity.ok("장소가 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("장소 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    // 위치 정보 전체 리스트
    @RequestMapping(value = "/map/selectLocationList.do")
    @ResponseBody
    public List<LocationVO> selectLocationList(LocationVO searchVO)
            throws Exception {
        return mapService.selectLocationList(searchVO);
    }

    // 장소 공유 상태 업데이트
    @RequestMapping(value = "/updateLocationSharedStatus.do", method = RequestMethod.POST)
    public ResponseEntity<String> updateLocationSharedStatus(@RequestBody LocationVO locationVO) {
        try {
            mapService.updateSharedStatus(locationVO.getLocationId(), locationVO.getIsShared());
            return ResponseEntity.ok("장소 공유 상태가 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("장소 공유 상태 업데이트에 실패했습니다: " + e.getMessage());
        }
    }
}