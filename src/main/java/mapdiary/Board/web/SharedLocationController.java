package mapdiary.Board.web;

import mapdiary.Board.service.SharedLocationService;
import mapdiary.Board.service.SharedLocationVO;
import mapdiary.user.service.UserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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

    // Community Page 공유 장소 리스트 반환, page 요청
    @RequestMapping(value = "/community.do")
    public String getCommunityPage(Model model, HttpSession session) {
        UserVO user = (UserVO) session.getAttribute("user");
        Long userId = (user != null) ? user.getId() : 0;

        List<Map<String, Object>> sharedLocations = sharedLocationService.getSharedLocations(userId);

        model.addAttribute("sharedLocations", sharedLocations);
        return "community";
    }

    // 장소 공유 저장
    @RequestMapping(value = "/saveSharedLocation.do", method = RequestMethod.POST)
    public ResponseEntity<String> saveSharedLocation(@RequestBody SharedLocationVO sharedLocation) {
        sharedLocationService.saveSharedLocation(sharedLocation);
        return ResponseEntity.ok("장소가 공유되었습니다");
    }

    // 장소 공유 삭제
    @RequestMapping(value = "/deleteSharedLocation.do", method = RequestMethod.POST)
    public ResponseEntity<String> deleteSharedLocation(@RequestBody SharedLocationDeleteRequestDto request) {
        try {
            sharedLocationService.deleteSharedLocation(request.getLocationId(), (long) request.getSharedUserId());
            return ResponseEntity.ok("장소 공유가 취소되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("장소 공유 취소에 실패했습니다: " + e.getMessage());
        }
    }

    // 공유된 장소 좋아요
    @RequestMapping(value = "/like.do", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> handleLike(@RequestParam("sharedId") int sharedId, @RequestParam("action") String action, HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        try {
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

            // 응답에 더 자세한 정보 추가
            response.put("sharedId", sharedId);
            response.put("action", action);
            response.put("liked", "like".equals(action));

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    // 삭제 시 좋아요 수 확인
    @RequestMapping(value = "/checkLikes.do", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> checkLikes(@RequestParam("locationId") int locationId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 좋아요 수 조회
            int likeCount = sharedLocationService.getLikeCount(locationId);
            response.put("success", true);
            response.put("likeCount", likeCount);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // 요청 객체 DTO
    public static class SharedLocationDeleteRequestDto {
        private int locationId;
        private int sharedUserId;

        public int getLocationId() { return locationId; }
        public void setLocationId(int locationId) { this.locationId = locationId; }

        public int getSharedUserId() { return sharedUserId; }
        public void setShared(int sharedUserId) { this.sharedUserId = sharedUserId; }
    }
}
