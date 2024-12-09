# 🗺️MapDiary

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
  
5. **cctv_data (CCTV 테이블)**
   - id (PK): CCTV 고유 식별자
   - coordtype: 좌표계 타입
   - roadsectionid: 도로구간 ID
   - coordx: 경도 좌표
   - coordy: 위도 좌표
   - cctvresolution: CCTV 해상도
   - filecreatetime: 파일 생성 시간
   - cctvtype: CCTV 타입
   - cctvformat: CCTV 포맷
   - cctvname: CCTV 명칭
   - cctvurl: CCTV 스트리밍 URL
   - geom: 공간 데이터

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
  
4. **CCTV 관련 기능**
   - 실시간 CCTV 영상 스트리밍
   - 지도 상 CCTV 위치 표시
   - CCTV 상세 정보 조회
   - 도로구간별 CCTV 조회

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

### 1. 데이터베이스 설정

1. PostgreSQL 설치 (PostGIS 확장 포함)
2. 데이터베이스 생성 및 PostGIS 확장 설치

sql
-- 데이터베이스 생성
CREATE DATABASE mapdiary;

-- PostGIS 확장 설치
CREATE EXTENSION postgis;

-- 테이블 생성
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
password VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
location_id SERIAL PRIMARY KEY,
location_nm VARCHAR(100) NOT NULL,
location_x NUMERIC,
location_y NUMERIC,
location_desc TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
geom geometry(Point, 4326),
user_id INTEGER REFERENCES users(id),
is_shared BOOLEAN DEFAULT false
);

CREATE TABLE shared_locations (
shared_id SERIAL PRIMARY KEY,
location_id INTEGER REFERENCES locations(location_id),
shared_user_id INTEGER REFERENCES users(id),
shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
like_count INTEGER DEFAULT 0
);

CREATE TABLE location_likes (
like_id SERIAL PRIMARY KEY,
shared_id INTEGER REFERENCES shared_locations(shared_id),
user_id INTEGER REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cctv_data (
id SERIAL PRIMARY KEY,
coordtype VARCHAR(20),
roadsectionid VARCHAR(50),
coordx NUMERIC,
coordy NUMERIC,
cctvresolution VARCHAR(20),
filecreatetime TIMESTAMP,
cctvtype VARCHAR(30),
cctvformat VARCHAR(20),
cctvname VARCHAR(100),
cctvurl TEXT,
geom geometry(Point, 4326)
);

-- 인덱스 생성
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
CREATE INDEX idx_cctv_data_geom ON cctv_data USING GIST(geom);

### 2. 프로젝트 설정
1. 프로젝트 클론

bash
git clone [repository URL]

2. 데이터베이스 연결 설정
- `src/main/resources/application.properties` 파일에서 데이터베이스 연결 정보 수정
properties
db.driver=org.postgresql.Driver
db.url=jdbc:postgresql://localhost:5432/mapdiary
db.username=your_username
db.password=your_password

3. 프로젝트 빌드
bash
mvn clean install

4. 서버 실행
- Eclipse에서 프로젝트를 Tomcat 서버에 추가하여 실행
- 또는 생성된 WAR 파일을 Tomcat webapps 디렉토리에 배포

### 3. API 키 설정

1. API 키 설정 파일 생성
- `src/main/webapp/js/apikey.js` 파일을 생성 (gitignore에 포함된 파일)
const KAKAO_API_KEY = '' //KAKAO API KEY 입력

### 4. GeoServer 설정

1. GeoServer 설치 및 실행
- GeoServer 2.22.2 이상 버전 설치 (https://geoserver.org/download/)
- 기본 포트: 8080 (Tomcat과 충돌 시 포트 변경 필요)

2. 작업공간(Workspace) 생성
- Name: mapdiary
- Namespace URI: http://mapdiary.org

3. 저장소(Store) 설정
- PostGIS 데이터베이스 연결
