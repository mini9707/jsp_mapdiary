package mapdiary.sharedLocation.web;

import mapdiary.sharedLocation.service.SharedLocationService;
import mapdiary.sharedLocation.service.SharedLocationVO;
import mapdiary.user.service.UserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class SharedLocationController {

    @Resource(name = "sharedLocationService")
    private SharedLocationService sharedLocationService;

    // 공유된 장소 목록 조회
    @RequestMapping("/community.do")
    @ResponseBody
    public List<Map<String, Object>> getSharedLocations(HttpSession session) {
        UserVO user = (UserVO) session.getAttribute("user");
        Long userId = (user != null) ? user.getId() : 0L;
        List<Map<String, Object>> locations = sharedLocationService.getSharedLocations(userId);

        if (user == null) {
            locations.forEach(location -> location.put("liked", false));
        }
        return locations;
    }

    // 장소 공유 저장
    @RequestMapping(value = "/saveSharedLocation.do", method = RequestMethod.POST)
    public ResponseEntity<String> saveSharedLocation(@RequestBody SharedLocationVO sharedLocation) {
        sharedLocationService.saveSharedLocation(sharedLocation);
        return ResponseEntity.ok("장소가 공유되었습니다");
    }

    // 장소 공유 삭제
    @RequestMapping(value = "/deleteSharedLocation.do", method = RequestMethod.POST)
    public ResponseEntity<String> deleteSharedLocation(@RequestBody SharedLocationVO sharedLocation) {
        try {
            sharedLocationService.deleteSharedLocation(sharedLocation.getLocationId(),
                    (long) sharedLocation.getSharedUserId());
            return ResponseEntity.ok("장소 공유가 취소되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("장소 공유 취소에 실패했습니다: " + e.getMessage());
        }
    }

    // 좋아요 처리
    @RequestMapping(value = "/like.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> handleLike(@RequestParam("sharedId") int sharedId, @RequestParam("action") String action, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        UserVO user = (UserVO) session.getAttribute("user");

        if (user == null) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return response;
        }

        boolean success = "like".equals(action) ?
                sharedLocationService.addLike(sharedId, user.getId()) :
                sharedLocationService.removeLike(sharedId, user.getId());

        response.put("success", success);
        response.put("sharedId", sharedId);
        response.put("action", action);
        response.put("liked", "like".equals(action));

        return response;
    }

    // 삭제 시 좋아요 수 확인
    @RequestMapping(value = "/checkLikes.do", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> checkLikes(@RequestParam("locationId") int locationId) {
        Map<String, Object> response = new HashMap<>();
        try {
            int likeCount = sharedLocationService.getLikeCount(locationId);
            response.put("success", true);
            response.put("likeCount", likeCount);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // 인기 장소 목록 조회
    @RequestMapping(value = "/getHotLocations.do", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String, Object>> getHotLocations() {
        return sharedLocationService.getHotLocations();
    }

    // 인기 장소 ID 목록 조회
    @RequestMapping(value = "/getHotLocationIds.do", method = RequestMethod.GET)
    @ResponseBody
    public List<Integer> getHotLocationIds() {
        return sharedLocationService.getHotLocationIds();
    }
}
