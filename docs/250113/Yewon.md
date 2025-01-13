## 1월 13일 황예원 진행 사항

### Git 컨벤션, 커밋 메시지 및 Git Flow 가이드 작성

## 1. 기본 규칙

- 새줄 문자는 LF 사용
- 대문자로 표시할 약어 명시
- static import만 와일드카드 허용
- 제한자 선언 순서: public → protected → private → abstract → static → final → transient → volatile → synchronized → native → strictfp
- else, catch, finally, while는 닫는 중괄호와 같은 줄에 선언
- 빈 블록은 새줄 없이 중괄호 닫기 허용

## 2. 커밋 메시지 구조

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Subject line

- 변경 사항에 대한 간단한 설명
- 70자 이내로 작성
- 첫 글자는 소문자로 시작, 마침표 없이 작성
- 명령형 현재 시제 사용 (changed → change)

### Message body

- 변경 이유와 변경 전후 비교 설명
- 각 줄은 70자 이내로 작성

### Message footer

- 주요 변경사항 상세 설명
- 이슈 참조: `Closes #123, #456`

## 3. 커밋 타입

| 타입     | 설명                               |
| -------- | ---------------------------------- |
| feat     | 새로운 기능 추가                   |
| fix      | 버그 수정                          |
| docs     | 문서 수정                          |
| style    | 코드 포맷팅, 세미콜론 누락 등      |
| refactor | 코드 리팩토링                      |
| test     | 테스트 코드                        |
| chore    | 빌드 업무 수정, 패키지 매니저 수정 |
| design   | UI 디자인 변경                     |
| comment  | 주석 추가 또는 변경                |
| rename   | 파일 또는 폴더명 수정              |
| remove   | 파일 삭제                          |

## 4. Git 작업 순서

1. Issue 생성
2. 브랜치 생성 및 연결
3. 최신 상태로 업데이트
4. 작업 수행
5. 변경사항 저장 (git add)
6. 커밋 메시지 작성 및 커밋
7. 브랜치에 푸시
8. 충돌 해결 (필요시)
9. Pull Request 생성 및 처리
10. 브랜치 정리

## 5. 커밋 템플릿 설정

## 6. Pull request 컨벤션

## 7. Git Flow

### 브랜치 네이밍

- master : 제품으로 출시될 수 있는 브랜치
- develop : 다음 출시 버전을 개발하는 브랜치
  - feature/기능 : 기능을 개발하는 브랜치
- release : 이번 출시 버전을 준비하는 브랜치
- hotfix : 출시 버전에서 발생한 버그를 수정 하는 브랜치
