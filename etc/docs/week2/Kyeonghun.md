## 1월 20일 민경훈 진행 사항
1. Spring Boot 공부
스프링 부트 3 백엔드 개발자 되기 : 자바 편 

2. TarotBot 구현
Spring boot를 공부하며 타로마스터 구현을 진행합니다.

강의나 책을 따라 구현 방법에 대해 공부하고 이를 정리합니다.

MySQL과 java Entity 연결하는 법

REST API를 통해 CRUD 구현 방법

작업한 파일

```
com.ssafy
├── api
│   ├── controller
│   │   └── TarotBotController.java
│   ├── request
│   │   └── TarotBotRegisterPostReq.java
│   ├── response
│   │   └── TarotBotRes.java
│   ├── service
│   │   ├── TarotBotService.java
│   │   └── TarotBotServiceImpl.java
├── db
│   ├── entity
│   │   └── TarotBot.java
│   ├── repository
│   │   ├── TarotBotRepository.java
│   │   └── TarotBotRepositorySupport.java
```


구현 사항

TarotBot 생성

TarotBot 이름 기반 조회

TarotBot 전체 조회