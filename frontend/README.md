# 🐛 곤충 캐릭터 변환기 - 프론트엔드

React 기반의 곤충 분류 및 캐릭터 생성 서비스 사용자 인터페이스입니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

브라우저에서 http://localhost:3000 으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 3. 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 테스트
npm run serve
```

## 📁 디렉토리 구조

```
frontend/
├── public/                 # 정적 파일
│   ├── index.html         # HTML 템플릿
│   └── manifest.json      # PWA 매니페스트
├── src/                   # 소스 코드
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   └── Header.js      # 네비게이션 헤더
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Home.js        # 홈 페이지
│   │   ├── Upload.js      # 업로드 페이지
│   │   ├── Result.js      # 결과 페이지
│   │   └── About.js       # 소개 페이지
│   ├── services/          # API 통신
│   │   └── api.js         # 백엔드 API 함수들
│   ├── App.js             # 메인 앱 컴포넌트
│   ├── index.js           # 앱 진입점
│   └── index.css          # 전역 스타일
└── package.json           # 프로젝트 설정
```

## 🎨 페이지 구성

### 1. 홈 페이지 (`/`)
- 서비스 소개
- 주요 기능 안내
- 사용 방법 설명

### 2. 업로드 페이지 (`/upload`)
- 드래그 앤 드롭 이미지 업로드
- 처리 옵션 선택 (분류만/캐릭터만/전체)
- 실시간 서버 연결 상태 확인

### 3. 결과 페이지 (`/result`)
- 분류 결과 표시
- 생성된 캐릭터 표시
- 결과 다운로드 및 공유

### 4. 소개 페이지 (`/about`)
- 프로젝트 정보
- 기술 스택 소개
- 팀 정보

## 🔧 주요 컴포넌트

### Header 컴포넌트
```javascript
// 네비게이션 헤더
// 반응형 모바일 메뉴 지원
<Header />
```

### Upload 컴포넌트
```javascript
// 이미지 업로드 및 처리
// 드래그 앤 드롭 지원
// 서버 연결 상태 체크
<Upload serverConnected={boolean} />
```

### Result 컴포넌트
```javascript
// 처리 결과 표시
// 이미지 다운로드 기능
// 결과 공유 기능
<Result />
```

## 🌐 API 통신

`src/services/api.js`에서 백엔드와의 모든 통신을 관리합니다.

### 주요 API 함수들

```javascript
// 서버 상태 확인
const status = await checkServerStatus();

// 이미지 업로드
const result = await uploadImage(file);

// 곤충 분류
const classification = await classifyInsect(file);

// 캐릭터 생성
const character = await generateCharacter(file);

// 전체 파이프라인
const fullResult = await processFullPipeline(file);
```

### 에러 처리

모든 API 함수는 try-catch로 에러를 처리하고, 사용자 친화적인 에러 메시지를 제공합니다.

## 🎨 스타일링

### Styled Components 사용

```javascript
import styled from 'styled-components';

const StyledButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  
  &:hover {
    transform: translateY(-2px);
  }
`;
```

### 디자인 시스템

- **주 색상**: `#667eea` (보라-파랑)
- **보조 색상**: `#764ba2`
- **성공**: `#4CAF50`
- **오류**: `#f44336`
- **배경**: 그라데이션 (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)

### 반응형 디자인

```css
@media (max-width: 768px) {
  /* 모바일 스타일 */
}
```

## 🔄 상태 관리

현재는 React의 기본 `useState`와 `useEffect`를 사용합니다.

### 주요 상태들

- 서버 연결 상태
- 업로드된 파일 정보
- 처리 결과 데이터
- 로딩 상태
- 에러 메시지

## 🧪 테스트

### 컴포넌트 테스트

```bash
npm test
```

### 테스트 작성 예시

```javascript
import { render, screen } from '@testing-library/react';
import Home from './pages/Home';

test('renders home page title', () => {
  render(<Home />);
  const titleElement = screen.getByText(/곤충 캐릭터 변환기/i);
  expect(titleElement).toBeInTheDocument();
});
```

## 🔍 문제 해결

### 자주 발생하는 문제

**1. 서버 연결 오류**
- 백엔드 서버가 실행 중인지 확인 (http://localhost:8000)
- CORS 설정 확인

**2. 이미지 업로드 실패**
- 파일 크기 제한 확인 (10MB)
- 지원되는 파일 형식 확인 (JPG, PNG, BMP, GIF)

**3. 빌드 오류**
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

**4. 스타일 적용 안됨**
- styled-components 버전 확인
- CSS import 순서 확인

## 🎯 개발 가이드

### 새 페이지 추가

1. `src/pages/` 폴더에 새 컴포넌트 생성
2. `App.js`에 라우트 추가
3. `Header.js`에 네비게이션 링크 추가

```javascript
// App.js에 라우트 추가
<Route path="/new-page" element={<NewPage />} />
```

### 새 컴포넌트 생성

```javascript
// src/components/NewComponent.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  /* 스타일 정의 */
`;

function NewComponent({ prop1, prop2 }) {
  return (
    <Container>
      {/* 컴포넌트 내용 */}
    </Container>
  );
}

export default NewComponent;
```

### API 함수 추가

```javascript
// src/services/api.js에 새 함수 추가
export const newApiFunction = async (data) => {
  try {
    const response = await api.post('/new-endpoint', data);
    return { success: true, data: response.data };
  } catch (error) {
    throw new Error(`API 호출 실패: ${error.message}`);
  }
};
```

## 🚀 성능 최적화

### 이미지 최적화

- 이미지 압축 고려
- Lazy Loading 구현
- 미리보기 이미지 크기 제한

### 코드 분할

```javascript
// 지연 로딩으로 번들 크기 최적화
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 사용 시 Suspense로 감싸기
<Suspense fallback={<div>로딩 중...</div>}>
  <LazyComponent />
</Suspense>
```

### 메모이제이션

```javascript
// 불필요한 리렌더링 방지
const MemoizedComponent = React.memo(ExpensiveComponent);

// 콜백 함수 메모이제이션
const handleClick = useCallback(() => {
  // 핸들러 로직
}, [dependency]);
```

## 📱 모바일 최적화

- 터치 친화적 버튼 크기
- 스와이프 제스처 지원 고려
- 모바일 키보드 대응
- 세로/가로 모드 대응

## 🔧 개발 도구

### 유용한 브라우저 확장

- React Developer Tools
- Redux DevTools (상태 관리 확장 시)

### VS Code 확장

- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

---

**Happy Coding! ⚛️**
