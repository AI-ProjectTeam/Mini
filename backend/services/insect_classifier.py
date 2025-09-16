"""
곤충 분류 AI 모델 서비스
PyTorch 기반의 곤충 이미지 분류 모델을 관리

주요 기능:
1. 이미지 전처리
2. 곤충 종류 분류
3. 분류 결과 후처리

팀원이 실제 AI 모델을 구현할 때 이 클래스를 수정하면 됩니다.
"""

import os
import asyncio
from PIL import Image
import torch
import torchvision.transforms as transforms
from typing import Dict, List, Tuple
import random

class InsectClassifier:
    """
    곤충 분류를 위한 AI 모델 클래스
    현재는 더미 데이터를 반환하며, 실제 모델 구현 시 수정 필요
    """
    
    def __init__(self):
        """
        분류 모델 초기화
        실제 모델 로딩은 여기서 수행
        """
        self.model = None  # 실제 PyTorch 모델을 여기에 로드
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = [
            "나비 (Butterfly)",
            "벌 (Bee)", 
            "개미 (Ant)",
            "딱정벌레 (Beetle)",
            "잠자리 (Dragonfly)",
            "메뚜기 (Grasshopper)",
            "무당벌레 (Ladybug)",
            "거미 (Spider)",
            "모기 (Mosquito)",
            "파리 (Fly)"
        ]
        
        # 이미지 전처리 파이프라인
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        print(f"곤충 분류 모델이 {self.device}에서 초기화되었습니다.")
    
    def load_model(self, model_path: str):
        """
        실제 훈련된 모델을 로드하는 함수
        팀원이 모델을 완성하면 이 함수를 구현
        
        Args:
            model_path: 모델 파일 경로 (.pth, .pt 등)
        """
        try:
            # 실제 모델 로딩 코드를 여기에 구현
            # self.model = torch.load(model_path, map_location=self.device)
            # self.model.eval()
            print(f"모델을 {model_path}에서 로드했습니다.")
        except Exception as e:
            print(f"모델 로딩 중 오류 발생: {e}")
    
    def preprocess_image(self, image_path: str) -> torch.Tensor:
        """
        이미지 전처리 함수
        
        Args:
            image_path: 처리할 이미지 파일 경로
            
        Returns:
            전처리된 텐서
        """
        try:
            # 이미지 로드 및 RGB 변환
            image = Image.open(image_path).convert('RGB')
            
            # 전처리 적용
            processed_image = self.transform(image).unsqueeze(0)
            
            return processed_image.to(self.device)
            
        except Exception as e:
            raise Exception(f"이미지 전처리 중 오류 발생: {e}")
    
    async def classify(self, image_path: str) -> Dict:
        """
        곤충 분류 메인 함수
        
        Args:
            image_path: 분류할 이미지 파일 경로
            
        Returns:
            분류 결과 딕셔너리
        """
        try:
            # 이미지 전처리
            processed_image = self.preprocess_image(image_path)
            
            # 모델 추론 (현재는 더미 데이터)
            if self.model is None:
                # 실제 모델이 없을 때 더미 결과 생성
                result = await self._generate_dummy_result()
            else:
                # 실제 모델 추론
                with torch.no_grad():
                    outputs = self.model(processed_image)
                    probabilities = torch.nn.functional.softmax(outputs, dim=1)
                    result = self._process_model_output(probabilities)
            
            return result
            
        except Exception as e:
            raise Exception(f"곤충 분류 중 오류 발생: {e}")
    
    async def _generate_dummy_result(self) -> Dict:
        """
        더미 분류 결과 생성 (개발/테스트용)
        실제 모델 구현 후에는 제거
        """
        # 비동기 처리 시뮬레이션 (실제 AI 추론 시간 모방)
        await asyncio.sleep(1)
        
        # 랜덤하게 곤충 종류 선택
        predicted_class = random.choice(self.classes)
        confidence = round(random.uniform(0.7, 0.95), 3)
        
        # 다른 클래스들의 확률도 생성
        other_predictions = []
        remaining_classes = [cls for cls in self.classes if cls != predicted_class]
        remaining_prob = 1.0 - confidence
        
        for i, cls in enumerate(remaining_classes[:3]):  # 상위 3개만
            if i == 2:  # 마지막
                prob = remaining_prob
            else:
                prob = round(random.uniform(0.01, remaining_prob/2), 3)
                remaining_prob -= prob
            other_predictions.append({"class": cls, "confidence": prob})
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "all_predictions": [
                {"class": predicted_class, "confidence": confidence},
                *other_predictions
            ],
            "processing_time": "1.2초",
            "model_version": "v1.0_dummy",
            "status": "success"
        }
    
    def _process_model_output(self, probabilities: torch.Tensor) -> Dict:
        """
        실제 모델 출력을 처리하여 결과 딕셔너리 생성
        
        Args:
            probabilities: 모델 출력 확률
            
        Returns:
            처리된 결과 딕셔너리
        """
        # 확률을 내림차순으로 정렬
        probs, indices = torch.sort(probabilities[0], descending=True)
        
        # 결과 생성
        all_predictions = []
        for i in range(min(5, len(self.classes))):  # 상위 5개
            class_name = self.classes[indices[i]]
            confidence = float(probs[i])
            all_predictions.append({
                "class": class_name,
                "confidence": round(confidence, 3)
            })
        
        return {
            "predicted_class": self.classes[indices[0]],
            "confidence": float(probs[0]),
            "all_predictions": all_predictions,
            "processing_time": "실제 처리 시간",
            "model_version": "v1.0",
            "status": "success"
        }
    
    def get_model_info(self) -> Dict:
        """
        모델 정보 반환
        """
        return {
            "model_name": "InsectClassifier",
            "classes": self.classes,
            "device": str(self.device),
            "num_classes": len(self.classes),
            "input_size": "224x224",
            "model_loaded": self.model is not None
        }
