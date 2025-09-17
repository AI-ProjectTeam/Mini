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
from config import settings

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

# AI 모델 인스턴스 초기화
insect_classifier = InsectClassifier(api_key=settings.GEMINI_API_KEY)  # Gemini API 기반 분류기
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

@app.post("/set-api-key")
async def set_api_key(api_key_data: dict):
    """
    Gemini API 키 설정 엔드포인트
    
    Args:
        api_key_data: {"api_key": "your_gemini_api_key"}
    
    Returns:
        API 키 설정 결과
    """
    global insect_classifier
    
    api_key = api_key_data.get("api_key")
    if not api_key:
        raise HTTPException(status_code=400, detail="API 키가 필요합니다.")
    
    try:
        # 기존 분류기에 API 키 설정
        insect_classifier.set_api_key(api_key)
        return {
            "message": "Gemini API 키가 성공적으로 설정되었습니다.",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API 키 설정 중 오류: {str(e)}")

@app.delete("/api-key")
async def remove_api_key():
    """
    Gemini API 키 해제 엔드포인트
    
    Returns:
        API 키 해제 결과
    """
    global insect_classifier
    
    try:
        insect_classifier.set_api_key(None)
        return {
            "message": "Gemini API 키가 성공적으로 해제되었습니다.",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API 키 해제 중 오류: {str(e)}")

@app.post("/classify-insect-detailed")
async def classify_insect_detailed(file: UploadFile = File(...)):
    """
    어린이용 상세 곤충 분류 엔드포인트
    Gemini API를 사용하여 어린이 친화적인 상세 정보 제공
    
    Args:
        file: 분류할 곤충 이미지 파일
    
    Returns:
        상세한 곤충 분류 결과 (어린이용)
    """
    try:
        # 파일 형식 확인
        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="지원되지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP만 가능합니다."
            )
        
        # 파일 크기 제한 (10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        file_size = 0
        file_content = bytearray()
        
        # 파일 읽기
        while True:
            chunk = await file.read(1024)
            if not chunk:
                break
            file_size += len(chunk)
            if file_size > max_size:
                raise HTTPException(
                    status_code=413,
                    detail="파일 크기가 너무 큽니다. 10MB 이하의 파일을 업로드하세요."
                )
            file_content.extend(chunk)
        
        # 이미지 유효성 검사
        try:
            from PIL import Image
            import io
            image = Image.open(io.BytesIO(file_content))
            image.verify()
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="유효하지 않은 이미지 파일입니다."
            )
        
        # Gemini API를 사용한 어린이용 곤충 분류
        if not insect_classifier.api_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API 키가 설정되지 않았습니다. /set-api-key를 먼저 호출하세요."
            )
        
        result = insect_classifier.classify_insect_for_kids(bytes(file_content), file.filename)
        
        if "success" in result and result["success"]:
            # 파싱된 데이터를 직접 반환 (프론트엔드에서 바로 사용할 수 있도록)
            parsed_data = result.get("parsed_data", {})
            return JSONResponse(content={
                "success": True,
                "data": parsed_data,  # 프론트엔드에서 바로 사용할 수 있도록 파싱된 데이터만 반환
                "filename": result["filename"],
                "timestamp": datetime.now().isoformat()
            })
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": result.get("error", "알 수 없는 오류가 발생했습니다."),
                    "timestamp": datetime.now().isoformat()
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"이미지 처리 중 오류가 발생했습니다: {str(e)}"
        )

@app.post("/classify-insect-simple")
async def classify_insect_simple(file: UploadFile = File(...)):
    """
    간단한 곤충 분류 엔드포인트
    파싱된 간단한 곤충 정보만 반환
    
    Args:
        file: 분류할 곤충 이미지 파일
    
    Returns:
        파싱된 간단한 곤충 정보
    """
    try:
        # 파일 형식 확인
        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="지원되지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP만 가능합니다."
            )
        
        # 파일 크기 제한 (10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        file_size = 0
        file_content = bytearray()
        
        # 파일 읽기
        while True:
            chunk = await file.read(1024)
            if not chunk:
                break
            file_size += len(chunk)
            if file_size > max_size:
                raise HTTPException(
                    status_code=413,
                    detail="파일 크기가 너무 큽니다. 10MB 이하의 파일을 업로드하세요."
                )
            file_content.extend(chunk)
        
        # 이미지 유효성 검사
        try:
            from PIL import Image
            import io
            image = Image.open(io.BytesIO(file_content))
            image.verify()
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="유효하지 않은 이미지 파일입니다."
            )
        
        # Gemini API를 사용한 곤충 분류
        if not insect_classifier.api_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API 키가 설정되지 않았습니다. /set-api-key를 먼저 호출하세요."
            )
        
        result = insect_classifier.classify_insect_for_kids(bytes(file_content), file.filename)
        
        if "success" in result and result["success"]:
            # 파싱된 데이터를 직접 반환 (프론트엔드에서 바로 사용할 수 있도록)
            parsed_data = result.get("parsed_data", {})
            return JSONResponse(content={
                "success": True,
                "data": parsed_data,  # 프론트엔드에서 바로 사용할 수 있도록 파싱된 데이터만 반환
                "filename": result["filename"],
                "timestamp": datetime.now().isoformat()
            })
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": result.get("error", "알 수 없는 오류가 발생했습니다."),
                    "timestamp": datetime.now().isoformat()
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"이미지 처리 중 오류가 발생했습니다: {str(e)}"
        )

@app.get("/model-status")
async def get_model_status():
    """
    AI 모델 상태 확인 엔드포인트
    
    Returns:
        모델 상태 정보
    """
    try:
        classifier_info = insect_classifier.get_model_info()
        generator_info = character_generator.get_model_info()
        
        return {
            "insect_classifier": classifier_info,
            "character_generator": generator_info,
            "status": "healthy",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"모델 상태 확인 중 오류: {str(e)}"
        )

if __name__ == "__main__":
    # 개발 서버 실행
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,  # 코드 변경 시 자동 재시작
        log_level="info"
    )
