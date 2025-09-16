"""
곤충 분류 및 캐릭터 변환 API 서버
FastAPI를 사용한 메인 애플리케이션

주요 기능:
1. 이미지 업로드 처리
2. 곤충 분류 AI 모델 연동
3. 캐릭터 변환 AI 모델 연동
4. CORS 설정으로 프론트엔드와 통신
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from datetime import datetime

# AI 모델 관련 임포트 (추후 구현)
from services.insect_classifier import InsectClassifier
from services.character_generator import CharacterGenerator

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="곤충 분류 및 캐릭터 변환 API",
    description="곤충 사진을 업로드하여 종류를 분류하고 귀여운 캐릭터로 변환하는 서비스",
    version="1.0.0"
)

# CORS 설정 - 프론트엔드와의 통신을 위해 필요
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 업로드된 이미지를 저장할 디렉토리 생성
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# AI 모델 인스턴스 초기화 (추후 실제 모델로 교체)
insect_classifier = InsectClassifier()
character_generator = CharacterGenerator()

@app.get("/")
async def root():
    """
    API 서버 상태 확인 엔드포인트
    프론트엔드에서 서버 연결 상태를 확인할 때 사용
    """
    return {
        "message": "곤충 분류 및 캐릭터 변환 API 서버가 정상 작동중입니다!",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """
    서버 헬스 체크 엔드포인트
    서버 상태와 AI 모델 로딩 상태를 확인
    """
    return {
        "server": "healthy",
        "models": {
            "insect_classifier": "loaded",
            "character_generator": "loaded"
        }
    }

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    이미지 업로드 엔드포인트
    
    Args:
        file: 업로드할 이미지 파일 (jpg, png, jpeg 등)
    
    Returns:
        업로드된 파일 정보 및 저장 경로
    """
    try:
        # 파일 확장자 검증
        allowed_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".gif"}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail="지원되지 않는 파일 형식입니다. jpg, png, jpeg, bmp, gif 파일만 업로드 가능합니다."
            )
        
        # 파일 저장
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "message": "이미지가 성공적으로 업로드되었습니다.",
            "filename": filename,
            "file_path": file_path,
            "file_size": len(content),
            "upload_time": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}")

@app.post("/classify-insect")
async def classify_insect(file: UploadFile = File(...)):
    """
    곤충 분류 엔드포인트
    업로드된 이미지에서 곤충 종류를 분류
    
    Args:
        file: 분류할 곤충 이미지 파일
    
    Returns:
        분류 결과 (곤충 종류, 확률 등)
    """
    try:
        # 이미지 저장
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"classify_{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # AI 모델로 곤충 분류 (현재는 더미 데이터)
        classification_result = await insect_classifier.classify(file_path)
        
        return {
            "message": "곤충 분류가 완료되었습니다.",
            "classification": classification_result,
            "processed_image": file_path,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"곤충 분류 중 오류가 발생했습니다: {str(e)}")

@app.post("/generate-character")
async def generate_character(file: UploadFile = File(...)):
    """
    캐릭터 생성 엔드포인트
    곤충 이미지를 귀여운 캐릭터로 변환
    
    Args:
        file: 캐릭터로 변환할 곤충 이미지 파일
    
    Returns:
        생성된 캐릭터 이미지 정보
    """
    try:
        # 이미지 저장
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"character_{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # AI 모델로 캐릭터 생성 (현재는 더미 데이터)
        character_result = await character_generator.generate(file_path)
        
        return {
            "message": "캐릭터 생성이 완료되었습니다.",
            "character": character_result,
            "original_image": file_path,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"캐릭터 생성 중 오류가 발생했습니다: {str(e)}")

@app.post("/process-full")
async def process_full_pipeline(file: UploadFile = File(...)):
    """
    전체 파이프라인 처리 엔드포인트
    곤충 분류 + 캐릭터 생성을 한 번에 처리
    
    Args:
        file: 처리할 곤충 이미지 파일
    
    Returns:
        분류 결과 + 생성된 캐릭터 정보
    """
    try:
        # 이미지 저장
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"full_{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # 1단계: 곤충 분류
        classification_result = await insect_classifier.classify(file_path)
        
        # 2단계: 캐릭터 생성
        character_result = await character_generator.generate(file_path)
        
        return {
            "message": "전체 처리가 완료되었습니다.",
            "classification": classification_result,
            "character": character_result,
            "original_image": file_path,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"전체 처리 중 오류가 발생했습니다: {str(e)}")

if __name__ == "__main__":
    # 개발 서버 실행
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,  # 코드 변경 시 자동 재시작
        log_level="info"
    )
