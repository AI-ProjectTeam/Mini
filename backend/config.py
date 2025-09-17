"""
애플리케이션 설정 관리
환경 변수와 기본 설정값들을 관리하는 모듈

주요 기능:
1. 환경 변수 로드
2. 기본 설정값 정의
3. 개발/운영 환경 구분
"""

import os
from typing import List
from dotenv import load_dotenv

# .env 파일에서 환경변수 로드
load_dotenv()

class Settings:
    """애플리케이션 설정 클래스"""
    
    # 서버 설정
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS 설정
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # 추가 개발 포트
    ]
    
    # 파일 업로드 설정
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
    
    # AI 모델 설정
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/")
    CLASSIFICATION_MODEL: str = os.getenv("CLASSIFICATION_MODEL", "insect_classifier.pth")
    GENERATION_MODEL: str = os.getenv("GENERATION_MODEL", "character_generator.pth")
    
    # 로깅 설정
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "logs/app.log")
    
    # API 설정
    API_TITLE: str = "곤충 분류 및 캐릭터 변환 API"
    API_DESCRIPTION: str = "곤충 사진을 업로드하여 종류를 분류하고 귀여운 캐릭터로 변환하는 서비스"
    API_VERSION: str = "1.0.0"
    
    # Google Gemini API 설정
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    
    def __init__(self):
        """설정 초기화 및 디렉토리 생성"""
        # 필요한 디렉토리들 생성
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)
        os.makedirs(self.MODEL_PATH, exist_ok=True)
        os.makedirs(os.path.dirname(self.LOG_FILE), exist_ok=True)

# 전역 설정 인스턴스
settings = Settings()
