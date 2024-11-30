package mapdiary.Board.web;

import mapdiary.Board.service.SharedLocationService;
import mapdiary.Board.service.SharedLocationVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Controller
public class SharedLocationController {

    @Resource(name = "sharedLocationService")
    private SharedLocationService sharedLocationService;

    @RequestMapping(value = "/community.do")
    public String getCommunityPage(Model model) {
        List<Map<String, Object>> sharedLocations = sharedLocationService.getSharedLocations();
        // 데이터 확인을 위한 로그
        for (Map<String, Object> location : sharedLocations) {
            System.out.println("Location data: " + location);
        }
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
            sharedLocationService.deleteSharedLocation(request.getLocationId(), request.getSharedUserId());
            return ResponseEntity.ok("장소 공유가 취소되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("장소 공유 취소에 실패했습니다: " + e.getMessage());
        }
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
