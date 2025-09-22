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

    #     self.prompt = (
    #     "cute chibi {keyword} insect, kawaii character, pure insect anatomy, round body, six legs, vibrant wings, big adorable eyes, cute antennae, simple clean art, children's book illustration cartoon, white background, happy, no anthropomorphism, high quality"
    # )
    #     self.negative_prompt = "poorly drawn, bad anatomy, deformed, ugly, extra limbs, incorrect number of legs, mutated, merged body parts, human, anthropomorphic, text, watermark, signature, blurred, grainy, realistic, 3d, complex background, dull colors, grayscale, multiple heads, too many eyes"
            
        self.prompt = (
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
        
        # print(f"캐릭터 생성 모델이 {self.device}에서 초기화되었습니다.")

        # 모델 warmup 실행으로 첫 번째 이미지 생성 속도 개선
        self._warmup_model()

    def _warmup_model(self):
        """
        모델 warmup을 통한 첫 번째 이미지 생성 속도 최적화
        
        목적:
        1. CUDA 커널 초기화: GPU에서 처음 연산 시 발생하는 지연을 미리 처리
        2. 메모리 할당: 필요한 GPU 메모리를 미리 할당하고 캐싱
        3. 가중치 최적화: 모델 가중치의 GPU 최적화를 사전에 완료
        4. cuDNN 알고리즘 선택: 최적의 convolution 알고리즘을 미리 결정
        
        이 과정을 통해 실제 사용자 요청 시 대기시간을 크게 단축할 수 있습니다.
        """
        logger.info("🔥 모델 warmup 시작 - 첫 번째 이미지 생성 속도 최적화를 위한 준비 작업")
        warmup_start_time = time.time()
        
        try:
            # warmup용 간단한 더미 프롬프트 생성
            # 실제 사용될 프롬프트와 유사한 구조로 구성하여 동일한 연산 경로를 거치도록 함
            warmup_prompt = "cute butterfly, soft pastels, simple details, plain background"
            
            logger.info(f"더미 프롬프트로 warmup 실행: '{warmup_prompt}'")
            
            # GPU 메모리 사용량 모니터링 (warmup 전)
            if torch.cuda.is_available():
                memory_before_warmup = torch.cuda.memory_allocated()
                logger.info(f"Warmup 전 GPU 메모리: {memory_before_warmup / 1024**3:.2f} GB")
            
            # 실제 추론과 동일한 조건으로 더미 이미지 생성
            # torch.no_grad()로 그래디언트 계산을 비활성화하여 메모리 절약
            with torch.no_grad():
                # 첫 번째 추론에서 발생하는 모든 초기화 작업을 여기서 처리
                warmup_image = self.pipe(
                    prompt=warmup_prompt,       # 더미 프롬프트
                    num_inference_steps=2,      # 빠른 생성을 위해 1스텝 (실제 사용과 동일)
                    guidance_scale=1.5,         # 가이던스 스케일 0 (실제 사용과 동일)
                    width=640,                  # 실제 사용과 동일한 해상도
                    height=400                  # 실제 사용과 동일한 해상도
                ).images[0]
            
            # warmup에서 생성된 이미지는 메모리에서 즉시 삭제
            # 파일로 저장하지 않고 메모리만 사용하여 디스크 I/O 최소화
            del warmup_image
            
            # GPU 메모리 사용량 모니터링 (warmup 후)
            if torch.cuda.is_available():
                memory_after_warmup = torch.cuda.memory_allocated()
                logger.info(f"Warmup 후 GPU 메모리: {memory_after_warmup / 1024**3:.2f} GB")
                memory_allocated = (memory_after_warmup - memory_before_warmup) / 1024**2
                logger.info(f"Warmup 메모리 할당량: {memory_allocated:.2f} MB")
                
                # GPU 메모리 캐시 정리로 불필요한 메모리 해제
                torch.cuda.empty_cache()
                logger.info("GPU 메모리 캐시 정리 완료")
            
            # warmup 완료 시간 측정 및 로깅
            warmup_time = time.time() - warmup_start_time
            logger.info(f"✅ 모델 warmup 완료! 소요시간: {warmup_time:.2f}초")
            logger.info("이제 사용자 요청 시 빠른 이미지 생성이 가능합니다.")
            
        except Exception as e:
            # warmup 실패 시에도 서비스는 정상 동작하도록 예외 처리
            # warmup 실패가 전체 서비스를 중단시키지 않도록 주의
            logger.warning(f"⚠️ 모델 warmup 실패 (서비스는 정상 동작): {e}")
            logger.info("첫 번째 이미지 생성 시 다소 지연될 수 있습니다.")
    
    
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
            prompt = self.prompt.format(keyword=keyword)
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
                    # negative_prompt=self.negative_prompt,
                    num_inference_steps=3,  # 빠른 생성을 위해 3스텝 사용
                    guidance_scale=1.5,     # 가이던스 스케일 1.5으로 설정하여 빠른 생성
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
    
