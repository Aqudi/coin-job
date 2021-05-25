# coin-job

## 프로젝트

### 프로필 페이지

내가 만든 Job - 할당전, 할당완료, 작업완료  
내가 수락한 Job - 수락, 포기, 완료

### 모든 Job 조회 페이지

아직 할당이 안 된 작업들 목록 표시 - 페이지네이션으로 목록으로 보여줌

### Job 상세 내용 조회 페이지

Job의 컨텐츠

### Job 생성 페이지

Job 생성에 필요한 정보들

- string title # Job 제목
- string content # Job 내용
- uint deadline # Job 데드라인
- uint reward # Job 도움
- uint dontdisturb # Job 수락 필요한 기능
- string contact # 오픈 카톡

## 개발

### 패키지 설치

- Ganache
  - `npm i -g ganache-cli`
- Truffle
  - windows의 경우에는 windows build tool이 필요하다.
  - `npm i -g truffle`
- 기타 개발에 필요한 패키지들
  - `npm i -D`

### 실행

#### Ganache 실행

- `npm run ganache`
- MetaMask에 Privae key를 이용해 계정 등록

#### DAPP 실행

- `npm run migrate && npm run dev`
- http://localhost:8080/ 접속
