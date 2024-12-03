package mapdiary.cctv.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mapdiary.cctv.service.CctvService;
import mapdiary.cctv.service.CctvVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service("CctvService")
public class CctvServiceImpl implements CctvService {

    @Resource(name="CctvDAO")
    private CctvDAO dao;

    private final Logger logger = LoggerFactory.getLogger(getClass());


    @Override
    @Scheduled(cron = "0 0 2 * * *") // 매일 새벽 2시 실행
    public int insertCctv() {
        dao.delteCctv();
        try {
            List<CctvVO> cctvApiData = getCctvApiData();

            int insertCount = dao.insertCctv(cctvApiData);
            logger.info("CCTV insert 성공 총 {} 건", insertCount);

            return insertCount;
        } catch (Exception e) {
            logger.error("error : {}", e);
            return -1;
        }
    }

    private List<CctvVO> getCctvApiData() throws IOException {
        String[] yidtBbox = new String[]{"127.01640437752152", "127.42910576477257", "37.08380198217018", "37.37153945272345"};
        StringBuilder urlBuilder =  new StringBuilder("https://openapi.its.go.kr:9443/cctvInfo?");
        Map<String, String> params = new LinkedHashMap<>();
        params.put("apiKey", "a1a330fa448e491c99ca91525f44561a");

        params.put("type", "all");
        params.put("cctvType", "1");
        //범위 여기 수정하면댐
        params.put("minX", "126.347625");
        params.put("maxX", "126.888908");
        params.put("minY", "37.375362");
        params.put("maxY", "37.746308");
        params.put("getType", "json");
        for( String key : params.keySet() ){
            if (!key.equals("apiKey"))  urlBuilder.append("&");
            urlBuilder.append(key).append("=").append(params.get(key));
        }

        StringBuilder sb = null;
        BufferedReader rd = null;
        HttpURLConnection conn = null;
        try {
            // api connection
            conn = (HttpURLConnection) new URL(urlBuilder.toString()).openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");

            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }
            sb = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                sb.append(line);
            }
        } catch(IOException e) {
            logger.error("ERROR : " + e);
        }finally {
            if(rd != null)rd.close();
            if(conn!=null)conn.disconnect();
        }

        ObjectMapper om = new ObjectMapper();
        JsonNode root = om.readTree(String.valueOf(sb)).path("response");

        if (root.size() == 0) return null;

        JsonNode field = root.path("data");

        List<CctvVO> list = new ArrayList<>();
        for (JsonNode node : field) {
            CctvVO vo = new CctvVO();
            vo.setCoorx(Double.valueOf(node.get("coordx").asText()));
            vo.setCoory(Double.valueOf(node.get("coordy").asText()));
            vo.setUrl(node.get("cctvurl").asText());
            vo.setName(node.get("cctvname").asText());
            list.add(vo);
        }
        return list;
    }

    @Override
    public CctvVO getCctvInfo(int id) {
        return dao.getCctvInfo(id);
    }

    @Override
    public List<CctvVO> getCctvList() {
        return dao.getCctvList();
    }


}
