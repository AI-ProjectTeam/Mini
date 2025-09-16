"""
개발용 서버 실행 스크립트
FastAPI 서버를 개발 모드로 실행

사용법:
python run_server.py

또는 직접 uvicorn 명령어 사용:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

import uvicorn
import os

if __name__ == "__main__":
    print("=" * 50)
    print("🐛 곤충 분류 및 캐릭터 변환 API 서버 시작")
    print("=" * 50)
    print("서버 주소: http://localhost:8000")
    print("API 문서: http://localhost:8000/docs")
    print("대화형 API: http://localhost:8000/redoc")
    print("=" * 50)
    
    # uploads 디렉토리 생성
    os.makedirs("uploads", exist_ok=True)
    
    # 서버 실행
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 코드 변경 시 자동 재시작
        log_level="info"
    )
