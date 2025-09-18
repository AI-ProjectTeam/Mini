"""
캐릭터 생성 AI 모델 서비스
곤충 이미지를 귀여운 캐릭터로 변환하는 생성형 AI 모델 관리

주요 기능:
1. 곤충 이미지 분석
2. 캐릭터 스타일 적용
3. 귀여운 캐릭터 이미지 생성

팀원이 실제 생성 모델을 구현할 때 이 클래스를 수정하면 됩니다.
"""

import os
import asyncio
from PIL import Image, ImageDraw, ImageFont
import torch
import random
import logging
import io
import time
from fastapi import HTTPException
from typing import Dict, List, Tuple
from datetime import datetime
from diffusers import AutoPipelineForText2Image

# 로깅 설정 - 메모리 사용량 모니터링을 위해
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CharacterGenerator:
    """
    곤충을 귀여운 캐릭터로 변환하는 생성형 AI 모델 클래스
    현재는 더미 데이터를 반환하며, 실제 모델 구현 시 수정 필요
    """
    
    def __init__(self):
        """
        캐릭터 생성 모델 초기화
        실제 생성 모델(GAN, Diffusion 등) 로딩은 여기서 수행
        """

        self.color_palettes = [
            ["#FFD1DC", "#FFB347", "#77DD77"],
            ["#AEC6CF", "#FF6961", "#CFCFC4"],
            ["#FDFD96", "#84B6F4", "#FDCAE1"]
        ]

        self.character_styles = ["cartoon", "pastel", "chibi"]

        self.model = None  # 실제 생성 모델을 여기에 로드
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.promtp = (
        "cute cartoon {keyword}, insect body with six legs, "
        "colorful wings, antennae, chibi style{keyword}, kawaii{keyword}, bright cheerful colors, "
        "children's book illustration, simple clean art style, white background, "
        "NOT human, NOT anthropomorphic, pure insect anatomy, adorable bug character"
    )
        
        # 앱 시작 시 모델 로드
        logger.info("모델 로딩 시작...")
        model_load_start_time = time.time()

        try:
            # 실제 생성 모델 로딩 코드를 여기에 구현
            # 예: GAN, Stable Diffusion, StyleGAN 등
            # self.model = torch.load(model_path, map_location=self.device)
            # self.model.eval()
            self.pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo",
            torch_dtype=torch.float16,  # fp16으로 메모리 사용량 절반으로 줄임
            variant="fp16",
            use_safetensors=True,  # 안전한 텐서 형식 사용
            low_cpu_mem_usage=True  # CPU 메모리 사용량 최적화
            )

            # GPU가 사용 가능한 경우에만 CUDA로 이동
            if torch.cuda.is_available():
                self.pipe.to("cuda")
                # GPU 메모리 최적화 설정
                torch.backends.cudnn.benchmark = True  # cuDNN 최적화
                torch.backends.cuda.matmul.allow_tf32 = True  # TF32 사용으로 성능 향상
                logger.info(f"GPU 메모리 사용량: {torch.cuda.memory_allocated() / 1024**3:.2f} GB")
            else:
                logger.warning("CUDA를 사용할 수 없습니다. CPU 모드로 실행됩니다.")

            model_load_time = time.time() - model_load_start_time
            logger.info(f"모델 로딩 완료! 소요시간: {model_load_time:.2f}초")

        except Exception as e:
            logger.error(f"모델 로딩 실패: {e}")
        
        print(f"캐릭터 생성 모델이 {self.device}에서 초기화되었습니다.")
    
    def load_model(self, model_path: str):
        """
        실제 훈련된 생성 모델을 로드하는 함수
        팀원이 모델을 완성하면 이 함수를 구현
        
        Args:
            model_path: 생성 모델 파일 경로
        """

        # 앱 시작 시 모델 로드
        logger.info("모델 로딩 시작...")
        model_load_start_time = time.time()

        try:
            # 실제 생성 모델 로딩 코드를 여기에 구현
            # 예: GAN, Stable Diffusion, StyleGAN 등
            # self.model = torch.load(model_path, map_location=self.device)
            # self.model.eval()
            self.pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo",
            torch_dtype=torch.float16,  # fp16으로 메모리 사용량 절반으로 줄임
            variant="fp16",
            use_safetensors=True,  # 안전한 텐서 형식 사용
            low_cpu_mem_usage=True  # CPU 메모리 사용량 최적화
            )

            # GPU가 사용 가능한 경우에만 CUDA로 이동
            if torch.cuda.is_available():
                self.pipe.to("cuda")
                # GPU 메모리 최적화 설정
                torch.backends.cudnn.benchmark = True  # cuDNN 최적화
                torch.backends.cuda.matmul.allow_tf32 = True  # TF32 사용으로 성능 향상
                logger.info(f"GPU 메모리 사용량: {torch.cuda.memory_allocated() / 1024**3:.2f} GB")
            else:
                logger.warning("CUDA를 사용할 수 없습니다. CPU 모드로 실행됩니다.")

            model_load_time = time.time() - model_load_start_time
            logger.info(f"모델 로딩 완료! 소요시간: {model_load_time:.2f}초")

        except Exception as e:
            logger.error(f"모델 로딩 실패: {e}")
    
    # def analyze_insect_features(self, image_path: str) -> Dict:
    #     """
    #     곤충 이미지에서 특징을 분석하여 캐릭터 생성에 활용
        
    #     Args:
    #         image_path: 분석할 곤충 이미지 경로
            
    #     Returns:
    #         분석된 특징 정보
    #     """
    #     try:
    #         # 이미지 로드
    #         image = Image.open(image_path)
    #         width, height = image.size
            
    #         # 더미 특징 분석 (실제로는 AI 모델로 분석)
    #         features = {
    #             "dominant_colors": random.choice(self.color_palettes),
    #             "size_category": random.choice(["작은", "중간", "큰"]),
    #             "shape_type": random.choice(["둥근", "긴", "넓은"]),
    #             "wing_type": random.choice(["투명한", "화려한", "단순한", "없음"]),
    #             "texture": random.choice(["매끄러운", "털이 있는", "광택있는", "거친"])
    #         }
            
    #         return features
            
    #     except Exception as e:
    #         raise Exception(f"곤충 특징 분석 중 오류 발생: {e}")
    
    async def generate(self, keyword: str):
        """
        캐릭터 생성 메인 함수
        
        Args:
            image_path: 원본 곤충 이미지 경로
            style: 캐릭터 스타일 (선택사항)
            
        Returns:
            생성 결과 딕셔너리
        """        
        # 모델이 로드되었는지 확인
        if self.pipe is None:
            raise HTTPException(status_code=503, detail="모델이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.")
        
        try:
            # 전체 요청 시작 시간
            total_start_time = time.time()
            print("1")
            # 요청 시작 로그
            logger.info(f"이미지 생성 요청: '{keyword}'")

            # 프롬프트 생성
            prompt = self.promtp.format(keyword=keyword)
            logger.info(f"생성된 프롬프트: {prompt[:100]}...")

            # GPU 메모리 사용량 로깅 (요청 전)
            if torch.cuda.is_available():
                memory_before = torch.cuda.memory_allocated()
                logger.info(f"생성 전 GPU 메모리: {memory_before / 1024**3:.2f} GB")

            # 이미지 생성 시작 시간
            generation_start_time = time.time()

            # 이미지 생성 (최적화된 설정)
            with torch.no_grad():  # 그래디언트 계산 비활성화로 메모리 절약
                image = self.pipe(
                    prompt=prompt,
                    num_inference_steps=1,  # 빠른 생성을 위해 1스텝만 사용
                    guidance_scale=0.0,     # 가이던스 스케일 0으로 설정하여 빠른 생성
                    width=640,              # 카드 비율에 맞게 가로를 더 넓게 (16:10 비율)
                    height=400              # 카드 이미지 섹션에 맞는 높이
                ).images[0]

            # 이미지 생성 완료 시간
            generation_time = time.time() - generation_start_time

            # GPU 메모리 사용량 로깅 (요청 후)
            if torch.cuda.is_available():
                memory_after = torch.cuda.memory_allocated()
                logger.info(f"생성 후 GPU 메모리: {memory_after / 1024**3:.2f} GB")
                logger.info(f"메모리 증가량: {(memory_after - memory_before) / 1024**2:.2f} MB")

            # 이미지 인코딩 시작 시간
            encoding_start_time = time.time()

            # 이미지를 메모리 버퍼에 저장
            buf = io.BytesIO()
            image.save(buf, format="PNG", optimize=True)  # PNG 최적화 옵션 추가
            buf.seek(0)

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_{keyword}.png"

            # 생성된 이미지 파일에 저장
            output_dir = "out_put_image"
            os.makedirs(output_dir, exist_ok=True)
            file_path = os.path.join(output_dir, filename)

            with open(file_path, "wb") as f:
                f.write(buf.getbuffer())

            # 이미지 인코딩 완료 시간
            encoding_time = time.time() - encoding_start_time

            # 생성된 이미지 객체 메모리에서 제거
            del image

            # 전체 요청 완료 시간
            total_time = time.time() - total_start_time

            # 성능 통계 로깅
            logger.info(f"이미지 생성 완료: '{keyword}'")
            logger.info(f"📊 성능 통계:")
            logger.info(f"   - 전체 소요시간: {total_time:.3f}초")
            logger.info(f"   - 이미지 생성: {generation_time:.3f}초")
            logger.info(f"   - 이미지 인코딩: {encoding_time:.3f}초")

            if torch.cuda.is_available():
                memory_used = (memory_after - memory_before) / 1024**2
                logger.info(f"   - 메모리 사용량: {memory_used:.2f} MB")

            # PNG 이미지를 스트리밍 응답으로 반환 (성능 정보 헤더 포함)
            return filename

        except Exception as e:
            logger.error(f"이미지 생성 실패: {e}")
            # 오류 발생 시 메모리 정리
            # cleanup_memory()
            raise HTTPException(status_code=500, detail=f"이미지 생성 중 오류가 발생했습니다: {str(e)}")
    
    # async def _generate_dummy_character(self, image_path: str, features: Dict, style: str) -> Dict:
    #     """
    #     더미 캐릭터 생성 (개발/테스트용)
    #     실제 생성 모델 구현 후에는 제거
    #     """
    #     # 생성 시간 시뮬레이션
    #     await asyncio.sleep(2)
        
    #     # 더미 캐릭터 이미지 생성 (간단한 도형으로 구성)
    #     character_path = await self._create_dummy_character_image(features, style)
        
    #     return {
    #         "character_image_path": character_path,
    #         "style_applied": style,
    #         "features_used": features,
    #         "generation_time": "2.3초",
    #         "model_version": "v1.0_dummy",
    #         "character_description": self._generate_character_description(features, style),
    #         "status": "success"
    #     }
    
    # async def _create_dummy_character_image(self, features: Dict, style: str) -> str:
    #     """
    #     간단한 더미 캐릭터 이미지 생성
    #     실제로는 AI 생성 모델이 처리
    #     """
    #     # 캐릭터 이미지 생성 (512x512 크기)
    #     img = Image.new('RGB', (512, 512), color='white')
    #     draw = ImageDraw.Draw(img)
        
    #     # 배경 색상
    #     bg_color = features["dominant_colors"][0]
    #     draw.rectangle([0, 0, 512, 512], fill=bg_color)
        
    #     # 캐릭터 몸체 (원형)
    #     body_color = features["dominant_colors"][1]
    #     draw.ellipse([156, 200, 356, 400], fill=body_color, outline='black', width=3)
        
    #     # 눈
    #     draw.ellipse([200, 240, 230, 270], fill='white', outline='black', width=2)
    #     draw.ellipse([282, 240, 312, 270], fill='white', outline='black', width=2)
    #     draw.ellipse([210, 250, 220, 260], fill='black')
    #     draw.ellipse([292, 250, 302, 260], fill='black')
        
    #     # 입
    #     draw.arc([230, 280, 282, 320], start=0, end=180, fill='black', width=3)
        
    #     # 더듬이
    #     draw.line([220, 200, 210, 150], fill='black', width=3)
    #     draw.line([292, 200, 302, 150], fill='black', width=3)
    #     draw.ellipse([205, 145, 215, 155], fill='black')
    #     draw.ellipse([297, 145, 307, 155], fill='black')
        
    #     # 날개 (있는 경우)
    #     if features["wing_type"] != "없음":
    #         wing_color = features["dominant_colors"][2]
    #         # 왼쪽 날개
    #         draw.ellipse([100, 220, 180, 300], fill=wing_color, outline='black', width=2)
    #         # 오른쪽 날개  
    #         draw.ellipse([332, 220, 412, 300], fill=wing_color, outline='black', width=2)
        
    #     # 파일 저장
    #     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    #     filename = f"character_{timestamp}.png"
    #     character_path = os.path.join("uploads", filename)
    #     img.save(character_path)
        
    #     return character_path
    
    # def _generate_character_description(self, features: Dict, style: str) -> str:
    #     """
    #     생성된 캐릭터에 대한 설명 생성
    #     """
    #     descriptions = [
    #         f"{features['size_category']} 크기의 귀여운 곤충 캐릭터",
    #         f"{features['shape_type']} 모양과 {features['wing_type']} 날개를 가진",
    #         f"{style}로 표현된 사랑스러운 캐릭터",
    #         f"{features['texture']} 질감의 특별한 매력을 지닌"
    #     ]
        
    #     return " ".join(random.sample(descriptions, 2))
    
    # async def _generate_real_character(self, image_path: str, features: Dict, style: str) -> Dict:
    #     """
    #     실제 AI 모델을 사용한 캐릭터 생성
    #     팀원이 실제 모델을 구현할 때 사용
    #     """
    #     # 실제 생성 모델 추론 코드
    #     with torch.no_grad():
    #         # 모델 입력 준비
    #         # input_tensor = self.preprocess_for_generation(image_path, features, style)
            
    #         # 모델 추론
    #         # generated_image = self.model(input_tensor)
            
    #         # 후처리 및 저장
    #         # character_path = self.postprocess_and_save(generated_image)
            
    #         pass
        
    #     return {
    #         "character_image_path": "실제 생성된 캐릭터 경로",
    #         "style_applied": style,
    #         "features_used": features,
    #         "generation_time": "실제 생성 시간",
    #         "model_version": "v1.0",
    #         "character_description": self._generate_character_description(features, style),
    #         "status": "success"
    #     }
    
    # def get_available_styles(self) -> List[str]:
    #     """
    #     사용 가능한 캐릭터 스타일 목록 반환
    #     """
    #     return self.character_styles
    
    # def get_model_info(self) -> Dict:
    #     """
    #     생성 모델 정보 반환
    #     """
    #     return {
    #         "model_name": "CharacterGenerator",
    #         "available_styles": self.character_styles,
    #         "device": str(self.device),
    #         "color_palettes": len(self.color_palettes),
    #         "output_size": "512x512",
    #         "model_loaded": self.model is not None
    #     }
