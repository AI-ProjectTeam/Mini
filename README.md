# 🐛 곤충 캐릭터 변환기

AI 기술을 활용하여 곤충 사진을 분류하고 귀여운 캐릭터로 변환하는 웹 서비스입니다

## 📋 프로젝트 개요

4일간의 미니 프로젝트로, 사용자가 업로드한 곤충 사진을 AI가 분석하여 종류를 분류하고, 그 특징을 바탕으로 귀여운 캐릭터를 생성하는 서비스입니다.

### 🎯 주요 기능

- **이미지 업로드**: 드래그 앤 드롭으로 간편한 곤충 사진 업로드
- **곤충 분류**: PyTorch 기반 딥러닝 모델로 곤충 종류 분류
- **캐릭터 생성**: 생성형 AI를 활용한 귀여운 캐릭터 변환
- **결과 다운로드**: 생성된 캐릭터 이미지 다운로드
- **반응형 디자인**: 모바일과 데스크톱 모든 환경 지원

## 🛠️ 기술 스택

### 백엔드
- **Python 3.8+**
- **FastAPI**: 고성능 웹 API 프레임워크
- **PyTorch**: 딥러닝 모델 구현
- **Uvicorn**: ASGI 웹 서버

### 프론트엔드
- **React 18**: 모던 사용자 인터페이스
- **Styled Components**: CSS-in-JS 스타일링
- **Axios**: HTTP 클라이언트
- **React Router**: 페이지 라우팅

### AI 모델
- **CNN**: 곤충 분류 모델
- **생성형 AI**: 캐릭터 생성 모델

## 📁 프로젝트 구조

```
mini/
├── backend/                 # Python 백엔드
│   ├── main.py             # FastAPI 메인 애플리케이션
│   ├── requirements.txt    # Python 의존성
│   ├── run_server.py       # 서버 실행 스크립트
│   ├── setup_env.py        # 환경 설정 스크립트
│   ├── config.py           # 설정 관리
│   ├── services/           # AI 모델 서비스
│   │   ├── insect_classifier.py    # 곤충 분류 모델
│   │   └── character_generator.py  # 캐릭터 생성 모델
│   ├── uploads/            # 업로드된 이미지 저장
│   └── models/             # AI 모델 파일 저장
├── frontend/               # React 프론트엔드
│   ├── public/             # 정적 파일
│   ├── src/                # 소스 코드
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── services/       # API 통신 서비스
│   │   └── App.js          # 메인 앱 컴포넌트
│   └── package.json        # Node.js 의존성
├── test_integration.py     # 통합 테스트 스크립트
└── README.md              # 프로젝트 문서
```

## 🚀 빠른 시작

### 1. 프로젝트 클론

```bash
git clone [your-repository-url]
cd mini
```

### 2. 백엔드 설정

```bash
cd backend

# 가상환경 생성 (권장)
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 또는 자동 설정 스크립트 사용
python setup_env.py
```

### 3. 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install
```

### 4. 서버 실행

**백엔드 서버 실행** (터미널 1):
```bash
cd backend
python run_server.py
```

**프론트엔드 서버 실행** (터미널 2):
```bash
cd frontend
npm start
```

### 5. 애플리케이션 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 🔧 개발 가이드

### 백엔드 개발

1. **AI 모델 구현**: `backend/services/` 폴더에서 실제 AI 모델 구현
2. **API 엔드포인트 추가**: `backend/main.py`에서 새로운 API 추가
3. **설정 변경**: `backend/config.py`에서 설정값 수정

### 프론트엔드 개발

1. **새 페이지 추가**: `frontend/src/pages/` 폴더에 새 컴포넌트 생성
2. **컴포넌트 개발**: `frontend/src/components/` 폴더에 재사용 가능한 컴포넌트 추가
3. **API 통신**: `frontend/src/services/api.js`에서 새 API 함수 추가

### 통합 테스트

```bash
# 통합 테스트 실행 (백엔드/프론트엔드 서버가 실행된 상태에서)
python test_integration.py
```

## 📝 API 문서

### 주요 엔드포인트

- `GET /`: 서버 상태 확인
- `GET /health`: 헬스 체크
- `POST /upload-image`: 이미지 업로드
- `POST /classify-insect`: 곤충 분류
- `POST /generate-character`: 캐릭터 생성
- `POST /process-full`: 전체 파이프라인 처리

자세한 API 문서는 서버 실행 후 http://localhost:8000/docs 에서 확인할 수 있습니다.

## 🎨 UI/UX 가이드

### 디자인 시스템

- **주 색상**: `#667eea` (보라-파랑 그라데이션)
- **보조 색상**: `#764ba2`
- **성공 색상**: `#4CAF50`
- **오류 색상**: `#f44336`

### 컴포넌트 스타일

- **카드**: 반투명 배경, 블러 효과
- **버튼**: 그라데이션, 호버 애니메이션
- **입력**: 둥근 모서리, 부드러운 전환

## 🧪 테스트

### 단위 테스트

```bash
# 백엔드 테스트 (추후 구현)
cd backend
python -m pytest

# 프론트엔드 테스트
cd frontend
npm test
```

### 통합 테스트

```bash
python test_integration.py
```

## 🔍 문제 해결

### 자주 발생하는 문제

**1. 백엔드 서버 연결 오류**
```bash
# 포트 8000이 사용 중인지 확인
netstat -an | grep 8000

# 다른 포트로 실행
uvicorn main:app --port 8001
```

**2. 프론트엔드 빌드 오류**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

**3. CORS 오류**
- `backend/main.py`의 CORS 설정 확인
- 프론트엔드 URL이 허용된 origins에 포함되어 있는지 확인

**4. AI 모델 로딩 오류**
- `backend/models/` 폴더에 모델 파일이 있는지 확인
- PyTorch 버전 호환성 확인

## 📦 배포 (추후 구현)

현재는 개발 환경만 지원하며, 배포는 프로젝트 범위에 포함되지 않습니다.

## 🤝 기여 가이드

### 개발 워크플로우

1. 기능별 브랜치 생성
2. 개발 및 테스트
3. Pull Request 생성
4. 코드 리뷰 후 병합

### 코딩 스타일

**Python (백엔드)**
- PEP 8 스타일 가이드 준수
- Type hints 사용 권장
- 한글 주석으로 상세한 설명

**JavaScript (프론트엔드)**
- ES6+ 문법 사용
- 함수형 컴포넌트 선호
- 한글 주석으로 상세한 설명

## 📄 라이선스

이 프로젝트는 교육 목적의 미니 프로젝트입니다.

## 👥 팀 정보

4일간의 팀 미니 프로젝트로 진행되었습니다.

### 역할 분담 (예시)
- **백엔드 AI 개발**: AI 모델 구현 및 API 개발
- **프론트엔드 개발**: UI/UX 디자인 및 React 개발
- **통합 및 테스트**: 전체 시스템 통합 및 테스트

## 🔮 향후 계획

- [ ] 실제 AI 모델 구현
- [ ] 더 많은 곤충 종류 지원
- [ ] 캐릭터 스타일 옵션 확장
- [ ] 사용자 갤러리 기능
- [ ] 모바일 앱 버전

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.

---

**즐거운 개발 되세요! 🚀**
