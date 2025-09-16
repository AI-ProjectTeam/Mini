# 👥 팀 개발 가이드

곤충 캐릭터 변환기 프로젝트의 팀원들을 위한 개발 가이드입니다.

## 🎯 프로젝트 목표

4일간의 미니 프로젝트로 AI 기반 곤충 분류 및 캐릭터 생성 웹 서비스를 개발합니다.

## 👨‍💻 역할 분담

### 🤖 AI/백엔드 개발자
**담당 영역**: AI 모델 구현 및 백엔드 API 개발

#### 주요 작업
1. **곤충 분류 모델 구현** (`backend/services/insect_classifier.py`)
   - CNN 기반 분류 모델 훈련
   - 모델 최적화 및 추론 속도 개선
   - 10가지 곤충 종류 분류

2. **캐릭터 생성 모델 구현** (`backend/services/character_generator.py`)
   - GAN 또는 Diffusion 모델 구현
   - 곤충 특징 기반 캐릭터 생성
   - 다양한 스타일 옵션 제공

3. **API 최적화**
   - 모델 로딩 시간 최적화
   - 배치 처리 구현
   - 에러 처리 강화

#### 시작 방법
```bash
cd backend
python setup_env.py  # 환경 설정
python run_server.py  # 서버 실행
```

#### 개발 우선순위
1. Day 1-2: 곤충 분류 모델 구현
2. Day 2-3: 캐릭터 생성 모델 구현
3. Day 4: 모델 최적화 및 통합 테스트

### 🎨 프론트엔드/UI 개발자
**담당 영역**: 사용자 인터페이스 및 사용자 경험 개발

#### 주요 작업
1. **UI/UX 개선** (`frontend/src/`)
   - 더 직관적인 업로드 인터페이스
   - 결과 페이지 시각화 개선
   - 애니메이션 및 인터랙션 추가

2. **반응형 디자인**
   - 모바일 최적화
   - 태블릿 지원
   - 다양한 화면 크기 대응

3. **사용자 경험 개선**
   - 로딩 상태 개선
   - 에러 메시지 사용자 친화적으로 개선
   - 결과 공유 기능 추가

#### 시작 방법
```bash
cd frontend
npm install     # 의존성 설치
npm start      # 개발 서버 실행
```

#### 개발 우선순위
1. Day 1: 현재 UI 분석 및 개선 계획
2. Day 2-3: 핵심 UI 컴포넌트 개선
3. Day 4: 반응형 디자인 및 최종 폴리싱

## 🛠️ 개발 환경 설정

### 공통 준비사항

1. **Git 설정**
```bash
git clone [repository-url]
cd mini
```

2. **통합 테스트 실행**
```bash
python test_integration.py
```

### 개발 브랜치 전략

```
main (배포용)
├── develop (개발 통합)
├── feature/ai-models (AI 모델)
├── feature/ui-improvement (UI 개선)
└── feature/integration (통합 작업)
```

## 📅 일정 계획

### Day 1: 환경 설정 및 기초 작업
- [ ] 개발 환경 설정 완료
- [ ] 현재 코드 분석 및 이해
- [ ] 각자 담당 영역 상세 계획 수립

### Day 2: 핵심 기능 개발
- [ ] AI 모델: 분류 모델 기초 구현
- [ ] UI: 핵심 컴포넌트 개선

### Day 3: 고급 기능 개발
- [ ] AI 모델: 캐릭터 생성 모델 구현
- [ ] UI: 고급 인터랙션 및 애니메이션

### Day 4: 통합 및 마무리
- [ ] 전체 시스템 통합 테스트
- [ ] 버그 수정 및 최적화
- [ ] 최종 발표 준비

## 🤝 협업 가이드

### 코드 스타일

**Python (백엔드)**
```python
"""
함수나 클래스에 대한 한글 설명
주요 기능과 사용법을 상세히 기술
"""

async def process_image(file_path: str) -> Dict[str, Any]:
    """
    이미지 처리 함수
    
    Args:
        file_path: 처리할 이미지 파일 경로
        
    Returns:
        처리 결과 딕셔너리
    """
    # 구체적인 구현 로직
    pass
```

**JavaScript (프론트엔드)**
```javascript
/**
 * 컴포넌트 설명
 * 주요 기능과 props 설명
 */
function ComponentName({ prop1, prop2 }) {
  // 상태 관리
  const [state, setState] = useState(initialValue);
  
  // 이벤트 핸들러
  const handleEvent = useCallback(() => {
    // 핸들러 로직
  }, [dependency]);
  
  return (
    // JSX 반환
  );
}
```

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 업무 수정, 패키지 매니저 수정 등

예시:
feat: 곤충 분류 CNN 모델 구현
fix: 이미지 업로드 크기 제한 오류 수정
docs: API 문서 업데이트
```

### Pull Request 가이드

1. **브랜치 생성**
```bash
git checkout -b feature/your-feature-name
```

2. **개발 및 커밋**
```bash
git add .
git commit -m "feat: 기능 설명"
```

3. **Push 및 PR 생성**
```bash
git push origin feature/your-feature-name
```

4. **PR 템플릿**
```markdown
## 변경 사항
- 구현한 기능이나 수정 사항 설명

## 테스트
- 테스트 방법 및 결과

## 스크린샷 (UI 변경 시)
- 변경 전/후 이미지

## 체크리스트
- [ ] 코드 리뷰 준비 완료
- [ ] 테스트 통과
- [ ] 문서 업데이트 (필요시)
```

## 🧪 테스트 가이드

### 개발 중 테스트

**백엔드 테스트**
```bash
cd backend
python run_server.py

# 다른 터미널에서
curl http://localhost:8000/health
```

**프론트엔드 테스트**
```bash
cd frontend
npm start
# http://localhost:3000 접속 확인
```

**통합 테스트**
```bash
# 백엔드, 프론트엔드 서버 실행 후
python test_integration.py
```

### 기능별 테스트

**AI 모델 테스트**
```python
# 분류 모델 테스트
from services.insect_classifier import InsectClassifier
classifier = InsectClassifier()
result = await classifier.classify("test_image.jpg")
print(result)

# 캐릭터 생성 테스트
from services.character_generator import CharacterGenerator
generator = CharacterGenerator()
character = await generator.generate("test_image.jpg")
print(character)
```

**UI 컴포넌트 테스트**
```bash
cd frontend
npm test
```

## 📊 진행 상황 추적

### 일일 스탠드업 (권장)
- 어제 한 일
- 오늘 할 일
- 막힌 부분이나 도움이 필요한 것

### 진행 상황 체크리스트

**AI/백엔드 개발**
- [ ] 곤충 분류 모델 기초 구현
- [ ] 모델 정확도 70% 이상 달성
- [ ] 캐릭터 생성 모델 구현
- [ ] API 응답 시간 5초 이내
- [ ] 에러 처리 완성

**프론트엔드/UI 개발**
- [ ] 업로드 UI 개선
- [ ] 결과 페이지 시각화 개선
- [ ] 모바일 반응형 완성
- [ ] 로딩 애니메이션 추가
- [ ] 에러 메시지 개선

## 🔧 문제 해결

### 자주 발생하는 문제들

**1. 개발 환경 문제**
- Python 버전: 3.8 이상 필요
- Node.js 버전: 16 이상 권장
- Git 설정 확인

**2. 모델 관련 문제**
- PyTorch 버전 호환성
- GPU 메모리 부족 시 CPU 사용
- 모델 파일 크기 관리

**3. UI 관련 문제**
- 브라우저 호환성
- 모바일 터치 이벤트
- 이미지 로딩 최적화

### 도움 요청 방법

1. **이슈 등록**: GitHub Issues에 상세한 문제 설명
2. **팀 채팅**: 즉시 도움이 필요한 경우
3. **코드 리뷰**: PR에서 특정 부분에 대한 의견 요청

## 🎯 성공 기준

### 최소 기능 (MVP)
- [ ] 이미지 업로드 기능
- [ ] 기본적인 곤충 분류
- [ ] 간단한 캐릭터 생성
- [ ] 결과 표시 및 다운로드

### 추가 목표
- [ ] 높은 분류 정확도 (80% 이상)
- [ ] 다양한 캐릭터 스타일
- [ ] 우수한 사용자 경험
- [ ] 모바일 완벽 지원

## 📞 연락처 및 리소스

### 유용한 링크
- **FastAPI 문서**: https://fastapi.tiangolo.com/
- **React 문서**: https://reactjs.org/docs/
- **PyTorch 튜토리얼**: https://pytorch.org/tutorials/
- **Styled Components**: https://styled-components.com/

### 개발 도구
- **API 테스트**: Postman 또는 curl
- **디버깅**: VS Code, Chrome DevTools
- **디자인**: Figma (필요시)

---

**함께 멋진 프로젝트를 만들어봅시다! 🚀**
