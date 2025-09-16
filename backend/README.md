# 🐛 곤충 캐릭터 변환기 - 백엔드

FastAPI 기반의 곤충 분류 및 캐릭터 생성 AI 서비스 백엔드입니다.

## 🚀 빠른 시작

### 1. 가상환경 설정

```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2. 의존성 설치

```bash
# 패키지 설치
pip install -r requirements.txt

# 또는 자동 설정 스크립트 사용
python setup_env.py
```

### 3. 서버 실행

```bash
# 개발 서버 실행
python run_server.py

# 또는 직접 uvicorn 사용
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📁 디렉토리 구조

```
backend/
├── main.py                 # FastAPI 메인 애플리케이션
├── config.py              # 설정 관리
├── requirements.txt       # Python 의존성
├── run_server.py          # 서버 실행 스크립트
├── setup_env.py           # 환경 설정 자동화
├── services/              # AI 모델 서비스
│   ├── __init__.py
│   ├── insect_classifier.py    # 곤충 분류 모델
│   └── character_generator.py  # 캐릭터 생성 모델
├── uploads/               # 업로드된 이미지 저장
├── models/                # AI 모델 파일 저장
└── logs/                  # 로그 파일
```

## 🔧 API 엔드포인트

### 기본 엔드포인트

- `GET /`: 서버 상태 확인
- `GET /health`: 헬스 체크 (모델 상태 포함)

### 이미지 처리 엔드포인트

- `POST /upload-image`: 단순 이미지 업로드
- `POST /classify-insect`: 곤충 분류만 수행
- `POST /generate-character`: 캐릭터 생성만 수행
- `POST /process-full`: 분류 + 캐릭터 생성 (전체 파이프라인)

### API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤖 AI 모델 구현 가이드

### 곤충 분류 모델 (`services/insect_classifier.py`)

현재는 더미 데이터를 반환합니다. 실제 모델 구현 시 다음 메서드들을 수정하세요:

```python
class InsectClassifier:
    def load_model(self, model_path: str):
        """실제 PyTorch 모델 로딩"""
        # self.model = torch.load(model_path)
        # self.model.eval()
        pass
    
    async def classify(self, image_path: str):
        """실제 분류 로직 구현"""
        # 실제 모델 추론 코드 작성
        pass
```

### 캐릭터 생성 모델 (`services/character_generator.py`)

현재는 간단한 도형으로 더미 캐릭터를 생성합니다. 실제 생성 모델 구현 시:

```python
class CharacterGenerator:
    def load_model(self, model_path: str):
        """생성 모델 (GAN, Diffusion 등) 로딩"""
        # self.model = torch.load(model_path)
        pass
    
    async def generate(self, image_path: str, style: str = None):
        """실제 캐릭터 생성 로직"""
        # 생성 모델 추론 코드 작성
        pass
```

## ⚙️ 설정 관리

`config.py`에서 애플리케이션 설정을 관리합니다:

```python
class Settings:
    HOST = "0.0.0.0"
    PORT = 8000
    MAX_FILE_SIZE = 10485760  # 10MB
    UPLOAD_DIR = "uploads"
    MODEL_PATH = "models/"
    # ... 기타 설정들
```

환경 변수를 통해 설정값을 오버라이드할 수 있습니다.

## 📝 로깅

애플리케이션 로그는 `logs/app.log` 파일에 저장됩니다.

로그 레벨 설정:
```python
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
```

## 🧪 테스트

### 개발 중 테스트

```bash
# 서버가 실행된 상태에서
curl http://localhost:8000/
curl http://localhost:8000/health
```

### 파일 업로드 테스트

```bash
# 이미지 파일 업로드 테스트
curl -X POST "http://localhost:8000/upload-image" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@test_image.jpg"
```

## 🔍 문제 해결

### 자주 발생하는 문제

**1. 포트 이미 사용 중**
```bash
# 다른 포트로 실행
uvicorn main:app --port 8001
```

**2. PyTorch 설치 오류**
```bash
# CPU 버전 설치
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**3. 파일 업로드 크기 제한**
- `config.py`의 `MAX_FILE_SIZE` 설정 확인
- 웹 서버 설정도 확인 필요

**4. CORS 오류**
- `main.py`의 `ALLOWED_ORIGINS` 설정 확인
- 프론트엔드 URL이 포함되어 있는지 확인

## 🔧 개발 팁

### 새로운 API 엔드포인트 추가

1. `main.py`에 새 함수 정의
2. FastAPI 데코레이터 추가
3. 요청/응답 모델 정의
4. 에러 처리 구현

### AI 모델 통합

1. `services/` 폴더에 새 모델 클래스 생성
2. `main.py`에서 모델 인스턴스 생성
3. API 엔드포인트에서 모델 호출

### 성능 최적화

- 모델 로딩을 앱 시작 시 한 번만 수행
- 비동기 처리 활용 (`async`/`await`)
- 이미지 전처리 최적화
- 캐싱 구현 고려

## 📦 배포 준비

현재는 개발 환경만 지원합니다. 운영 배포 시 고려사항:

- 환경 변수 설정
- 로그 관리
- 보안 설정
- 모델 파일 관리
- 정적 파일 서빙

---

**Happy Coding! 🐍**
