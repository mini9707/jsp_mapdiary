package mapdiary.map.web;

import mapdiary.map.service.LocationVO;
import mapdiary.map.service.MapService;
import mapdiary.user.service.UserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
public class MapController {

    @Resource(name = "mapService")
    private MapService mapService;

    @RequestMapping("/test.do")
    public String test(Model model) {
        return "mapMain";
    }

    @RequestMapping("/myplace.do")
    public String myPlace(HttpSession session) {
        UserVO user = (UserVO) session.getAttribute("user");

        if (user == null) {
            return "login";
        }

        return "myplace";
    }

    // 서비스 컨트롤러
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

    // 위치 정보 전체 리스트
    @RequestMapping(value = "/map/selectLocationList.do")
    @ResponseBody
    public List<LocationVO> selectLocationList(LocationVO searchVO)
            throws Exception {
        return mapService.selectLocationList(searchVO);
    }

    // 장소 공유 상태 업데이트
    @RequestMapping(value = "/updateLocationSharedStatus.do", method = RequestMethod.POST)
    public ResponseEntity<String> updateLocationSharedStatus(@RequestBody LocationUpdateRequestDto request) {
        try {
            mapService.updateSharedStatus(request.getLocationId(), request.getIsShared());
            return ResponseEntity.ok("장소 공유 상태가 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("장소 공유 상태 업데이트에 실패했습니다: " + e.getMessage());
        }
    }

    // 요청 객체 클래스
    public static class LocationUpdateRequestDto {
        private int locationId;
        private boolean isShared;

        public int getLocationId() {
            return locationId;
        }

        public void setLocationId(int locationId) {
            this.locationId = locationId;
        }

        public boolean getIsShared() {
            return isShared;
        }

        public void setShared(boolean isShared) {
            this.isShared = isShared;
        }
    }

}