# Today Book Server - Insomnia API 테스트 문서

## 기본 설정

- **Base URL**: `http://localhost:3000/api`
- **인증 방식**: JWT 쿠키 (자동으로 쿠키에 저장됨)
- **Content-Type**: `application/json`

---

## 🔐 인증 관련 API

### 1. 카카오 로그인
```
GET /auth/kakao
```
- **설명**: 카카오 OAuth 로그인 페이지로 리다이렉트
- **응답**: 302 Redirect

### 2. 카카오 로그인 콜백
```
GET /auth/kakao/callback?code={authorization_code}
```
- **설명**: 카카오에서 전달받은 인증코드로 로그인 처리
- **Query Parameters**:
  - `code`: 카카오에서 전달받은 인증코드
- **응답**: JWT 쿠키 설정 후 클라이언트로 리다이렉트

---

## 🧪 JWT 테스트 API (개발환경 전용)

### 1. 테스트 토큰 생성
```
POST /jwt-cookie/test-sign
Content-Type: application/json

{
  "id": 1,
  "email": "test@example.com"
}
```
- **설명**: 개발용 JWT 토큰 생성 및 쿠키 설정
- **Body**: JwtCookiePayload
- **응답**: 
```json
{
  "message": "JWT 토큰이 생성되고 쿠키에 설정되었습니다.",
  "token": "eyJ...",
  "payload": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

### 2. 토큰 검증
```
GET /jwt-cookie/test-verify?token={jwt_token}
```
- **설명**: JWT 토큰 유효성 검증
- **Query Parameters**:
  - `token`: 검증할 JWT 토큰
- **응답**:
```json
{
  "valid": true,
  "payload": {
    "id": 1,
    "email": "test@example.com"
  },
  "message": "토큰이 유효합니다."
}
```

### 3. 로그아웃
```
POST /jwt-cookie/logout
```
- **설명**: JWT 쿠키 삭제
- **응답**:
```json
{
  "message": "로그아웃되었습니다."
}
```

---

## 👤 사용자 관리 API

### 1. 사용자 생성
```
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "nickname": "사용자닉네임",
  "image": "https://example.com/profile.jpg"
}
```
- **설명**: 새 사용자 계정 생성
- **Body**: CreateUserDto

### 2. 현재 사용자 조회 🔒
```
GET /users/me
```
- **설명**: 현재 로그인한 사용자 정보 조회
- **인증**: JWT 필요

### 3. 사용자 정보 수정 🔒
```
PATCH /users
Content-Type: application/json

{
  "nickname": "새로운닉네임"
}
```
- **설명**: 현재 사용자의 닉네임 수정
- **인증**: JWT 필요
- **Body**: UpdateUserDto

### 4. 사용자 삭제 🔒
```
DELETE /users/me
```
- **설명**: 현재 사용자 계정 삭제
- **인증**: JWT 필요
- **응답**: 204 No Content

---

## 📚 도서 관리 API

### 1. 도서 검색
```
GET /books/search?keyword=검색어&keywordType=Keyword&page=1&limit=20&sort=accuracy&categoryId=0
```
- **설명**: 키워드로 도서 검색
- **Query Parameters**:
  - `keyword` (필수): 검색 키워드
  - `keywordType` (선택): 검색 타입 (기본값: "Keyword")
  - `page` (선택): 페이지 번호 (기본값: 1)
  - `limit` (선택): 페이지당 항목 수 (기본값: 20)
  - `sort` (선택): 정렬 방식 (기본값: "accuracy")
  - `categoryId` (선택): 카테고리 ID (기본값: "0")

### 2. 특정 도서 조회
```
GET /books/{isbn13}
```
- **설명**: ISBN13으로 특정 도서 정보 조회
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드

### 3. 도서 목록 조회
```
GET /books?type=신간전체&categoryId=0&page=1&limit=20
```
- **설명**: 도서 목록 조회
- **Query Parameters**:
  - `type` (필수): 도서 타입
  - `categoryId` (선택): 카테고리 ID
  - `page` (선택): 페이지 번호 (기본값: 1)
  - `limit` (선택): 페이지당 항목 수 (기본값: 20)

---

## 📝 리뷰 관리 API (🔒 모든 엔드포인트 인증 필요)

### 1. 리뷰 생성
```
POST /reviews/{isbn13}
Content-Type: application/json

{
  "content": "이 책은 정말 좋습니다. 추천합니다!"
}
```
- **설명**: 특정 도서에 리뷰 작성
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드
- **Body**: CreateReviewDto (1-1000자)

### 2. 도서별 리뷰 조회
```
GET /reviews/{isbn13}?page=1&limit=10
```
- **설명**: 특정 도서의 리뷰 목록 조회 (페이지네이션)
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드
- **Query Parameters**:
  - `page` (선택): 페이지 번호 (기본값: 1)
  - `limit` (선택): 페이지당 항목 수 (기본값: 10, 최대: 50)
- **응답**:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [
    {
      "id": 1,
      "content": "리뷰 내용",
      "userId": 1,
      "bookIsbn13": "9788936433598",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": 1,
        "nickname": "사용자닉네임",
        "image": "https://example.com/profile.jpg"
      }
    }
  ]
}
```

### 3. 리뷰 수정
```
PATCH /reviews/{isbn13}
Content-Type: application/json

{
  "content": "수정된 리뷰 내용입니다."
}
```
- **설명**: 자신이 작성한 리뷰 수정
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드
- **Body**: UpdateReviewDto (1-1000자)

### 4. 리뷰 삭제
```
DELETE /reviews/{isbn13}
```
- **설명**: 자신이 작성한 리뷰 삭제
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드

---

## ❤️ 좋아요 관리 API (🔒 모든 엔드포인트 인증 필요)

### 1. 좋아요 추가
```
POST /likes/{isbn13}
```
- **설명**: 특정 도서에 좋아요 추가
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드
- **응답**: 201 Created

### 2. 좋아요 취소
```
DELETE /likes/{isbn13}
```
- **설명**: 특정 도서의 좋아요 취소
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드
- **응답**: 204 No Content

### 3. 내 좋아요 목록 조회
```
GET /likes/me
```
- **설명**: 현재 사용자가 좋아요한 도서 목록 조회

### 4. 도서 좋아요 수 조회
```
GET /likes/book/{isbn13}/count
```
- **설명**: 특정 도서의 총 좋아요 수 조회
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드
- **응답**:
```json
{
  "count": 42
}
```

### 5. 사용자 좋아요 여부 확인
```
GET /likes/book/{isbn13}/check
```
- **설명**: 현재 사용자가 특정 도서에 좋아요를 했는지 확인
- **Path Parameters**:
  - `isbn13`: 도서의 ISBN13 코드
- **응답**:
```json
{
  "isLiked": true
}
```

---

## 📱 Insomnia 설정 팁

### 1. 환경 변수 설정
```json
{
  "base_url": "http://localhost:3000/api",
  "test_user_id": 1,
  "test_email": "test@example.com",
  "sample_isbn": "9788936433598"
}
```

### 2. 테스트 순서 권장사항

1. **개발 환경 인증 설정**:
   ```
   POST {{base_url}}/jwt-cookie/test-sign
   ```

2. **사용자 정보 확인**:
   ```
   GET {{base_url}}/users/me
   ```

3. **도서 검색**:
   ```
   GET {{base_url}}/books/search?keyword=소설
   ```

4. **리뷰 작성**:
   ```
   POST {{base_url}}/reviews/{{sample_isbn}}
   ```

5. **좋아요 추가**:
   ```
   POST {{base_url}}/likes/{{sample_isbn}}
   ```

### 3. 쿠키 설정
- Insomnia에서 "Send cookies automatically" 옵션을 활성화하세요
- JWT 토큰이 자동으로 쿠키에 저장되어 인증이 필요한 API에서 자동 사용됩니다

---

## 🚨 주의사항

- 🔒 표시된 API는 JWT 인증이 필요합니다
- 개발환경에서만 JWT 테스트 API를 사용할 수 있습니다
- 리뷰 내용은 1-1000자 제한이 있습니다
- 페이지네이션에서 limit는 최대 50까지 설정 가능합니다
- ISBN13 형식을 정확히 입력해야 합니다

---

## 📋 샘플 데이터

### 테스트용 ISBN13 코드들
- `9788936433598` - 소설 샘플
- `9788932473901` - 에세이 샘플
- `9788936434267` - 자기계발서 샘플

### 테스트용 사용자 정보
```json
{
  "id": 1,
  "email": "test@example.com",
  "nickname": "테스트사용자",
  "image": "https://example.com/profile.jpg"
}
``` 