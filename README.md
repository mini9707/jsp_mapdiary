# MapDiary

**MapDiary**

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


## 실행 방법

