🗺️# MapDiary

**나만의 지도 일기장**

---

## 프로젝트 개요

- **프로젝트명**: MapDiary  
- **주요 기능**:  

---

## 주요 기술 스택

- **Backend**: Java8, Spring Framework, MyBatis, eGovFramework
- **Database**: PostgreSQL, PostGIS
- **Frontend**: JSP, JavaScript, jQuery, OpenLayers, BootStrap
- **API 통합**: GeoServer, ITS 국가교통정보센터 (실시간 교통정보, CCTV)
- **ETC**: 전자정부 표준프레임워크 기반

---

## 데이터베이스 설계

![image](https://github.com/user-attachments/assets/74716d3d-9a15-476a-a118-0459ff3bf2ab)

#### 테이블 구조

1. **locations (장소 테이블)**
   - location_id (PK): 장소 고유 식별자
   - location_nm: 장소명
   - location_x: 경도 좌표
   - location_y: 위도 좌표
   - location_desc: 장소 설명
   - created_at: 생성일시
   - geom: 공간 데이터
   - user_id (FK): 작성자 ID
   - is_shared: 공유 여부

2. **shared_locations (공유된 장소 테이블)**
   - shared_id (PK): 공유 고유 식별자
   - location_id (FK): 장소 ID
   - shared_user_id (FK): 공유한 사용자 ID
   - shared_at: 공유 일시
   - like_count: 좋아요 수

3. **location_likes (좋아요 테이블)**
   - like_id (PK): 좋아요 고유 식별자
   - shared_id (FK): 공유된 장소 ID
   - user_id (FK): 좋아요한 사용자 ID
   - created_at: 좋아요 생성 일시

4. **users (사용자 테이블)**
   - id (PK): 사용자 고유 식별자
   - username: 사용자명
   - password: 비밀번호
   - email: 이메일
   - created_at: 가입일시

## 주요 기능

1. **위치 기반 기능**
   - 지도 기반 장소 등록/수정/삭제
   - 장소별 상세 정보 조회
   - 실시간 교통정보 레이어 제공
   - CCTV 영상 스트리밍 서비스

2. **공유 기능**
   - 장소 공유하기
   - 공유된 장소 좋아요
   - 인기 장소 목록 제공 (좋아요 5개 이상)

3. **사용자 기능**
   - 회원가입/로그인
   - 내 장소 관리
   - 공유한 장소 관리

## 화면 구성

1. **메인 화면**
   - 지도 영역
   - 사이드바 (장소 목록)
   - 레이어 컨트롤러

2. **팝업**
   - 장소 등록/수정 팝업
   - 장소 상세정보 팝업
   - CCTV 영상 팝업

## 개발 환경

- **IDE**: Eclipse
- **Build Tool**: Maven
- **Server**: Apache Tomcat 8.5
- **Java Version**: JDK 1.8
- **Framework Version**: 전자정부 프레임워크 3.10.0

## 외부 API 연동

1. **국가교통정보센터**
   - 실시간 교통정보 API
   - CCTV 영상정보 API

2. **GeoServer**
   - 공간 데이터 관리
   - WMS/WFS 서비스 제공

## 실행 방법

