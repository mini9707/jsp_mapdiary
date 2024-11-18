<%@page import="java.net.URLDecoder"%>
<%@ page language="java"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Map"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.OutputStream"%>
<%@page import="java.io.IOException"%>
<%@page import="java.util.Enumeration"%>
<%@page import="java.net.HttpURLConnection"%>

<%@page import="java.net.URL"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="org.springframework.expression.spel.ast.Projection"%>
<%!

    public static String getParam(HttpServletRequest request, String name) {
        String fullUrl = "";
        Map map = (Map) request.getAttribute("Map");
        if (map == null) {
            map = new HashMap();

            Enumeration e = request.getParameterNames();
            boolean vworld = false;
            boolean freeze = false;
            boolean chk = false;
            while (e.hasMoreElements()) {
                String key = (String) e.nextElement();
                String value = request.getParameter(key);

                try {
                    if(!key.toUpperCase().equals("URL")){


                        if(value.toUpperCase().indexOf("%") == -1){
                            value = URLEncoder.encode(value, "UTF-8");
                        }

                        fullUrl += key + "=" + value+"&";
                    } else {

                        fullUrl = value + "?";
                    }

                } catch (Exception ex) {
                    System.out.println(ex);
                }
                map.put(key.toUpperCase(), value);
            }
            if(true) map.put("URL",fullUrl);

            request.setAttribute("Map", map);
        }
        return (String) map.get(name.toUpperCase());
    }

    public static void proxy(HttpServletRequest request,
                             HttpServletResponse response) throws ServletException, IOException {

        try{
            String urlParam = getParam(request, "URL");
            if (urlParam == null || urlParam.trim().length() == 0) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
// 			System.out.println("ddd : " + urlParam);
// 			urlParam = "http://cctvsec.ktict.co.kr/160/QpiooxgrpNOmIHeso7p/uChVcfU3RrDFae+QlacnsgGJkleU5wq/dbrN1x390qzBkVBPEsQI+2C7PqgF6GCMmGUzz/5M6FWYeDxYPJkO2XY=";
            boolean doPost = request.getMethod().equalsIgnoreCase("POST");
            URL url = new URL(urlParam);
            HttpURLConnection http = (HttpURLConnection) url.openConnection();
//	 		http.setConnectTimeout(3000);
//	 		http.setReadTimeout(3000);
            Enumeration headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String key = (String) headerNames.nextElement();
                if (!key.equalsIgnoreCase("Host")) {
                    http.setRequestProperty(key, request.getHeader(key));
                }
            }

            http.setDoInput(true);
            http.setDoOutput(doPost);

            byte[] buffer = new byte[32768];
            int read = -1;

            if (doPost) {
                OutputStream os = http.getOutputStream();
                ServletInputStream sis = request.getInputStream();
                while ((read = sis.read(buffer)) != -1) {
                    os.write(buffer, 0, read);
                }
                os.close();
            }

            InputStream is = http.getInputStream();
            response.setStatus(http.getResponseCode());
            response.setContentType("charset=utf-8");
            response.setCharacterEncoding("utf-8");

            Map headerKeys = http.getHeaderFields();
            Set	keySet = headerKeys.keySet();
            Iterator iter = keySet.iterator();
            while (iter.hasNext()) {
                String key = (String) iter.next();
                String value = http.getHeaderField(key);
                if (key != null && value != null) {
                    response.setHeader(key, value);
                }
            }

            ServletOutputStream sos = response.getOutputStream();
            response.resetBuffer();
            while ((read = is.read(buffer)) != -1) {
                sos.write(buffer, 0, read);
            }

            response.flushBuffer();
            sos.close();
        }catch(Exception e){
            e.printStackTrace();
        }

    }


%><%
    try {
        out.clear();
        out=pageContext.pushBody();
        proxy(request, response);

    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.setContentType("text/plain");
%><%=e.getStackTrace()[0].getMethodName() + ":" + e.getStackTrace()[0].getLineNumber()%><%
    }
    if (true) {
        return;
    }
%>
