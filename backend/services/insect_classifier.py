"""
곤충 분류 AI 모델 서비스
Google Gemini API 기반의 어린이용 곤충 이미지 분류 모델을 관리

주요 기능:
1. 이미지 전처리 및 인코딩
2. Gemini API를 통한 곤충 종류 분류
3. 어린이 친화적인 분류 결과 후처리

Google Gemini API를 사용하여 실제 곤충 분류를 수행합니다.
"""

import os
import asyncio
from PIL import Image
import torch
import torchvision.transforms as transforms
from typing import Dict, List, Tuple, Optional, Any
import random
import requests
import base64
import json
import tempfile
import shutil
import io
import re

class InsectClassifier:
    """
    어린이용 곤충 분류를 위한 AI 모델 클래스
    Google Gemini API를 사용하여 실제 곤충 분류 수행
    """
    
    def __init__(self, api_key: str = None):
        """
        분류 모델 초기화
        Gemini API 키를 사용하여 실제 분류 서비스 초기화
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        
        if self.api_key:
            self.headers = {
                'Content-Type': 'application/json',
                'X-goog-api-key': self.api_key
            }
        else:
            self.headers = None
            print("경고: GEMINI_API_KEY가 설정되지 않았습니다. 더미 모드로 실행됩니다.")
        
        # 기존 호환성을 위한 속성들
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
        
        # 이미지 전처리 파이프라인 (호환성 유지)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        print(f"곤충 분류 모델이 초기화되었습니다. API 키 상태: {'설정됨' if self.api_key else '미설정'}")
    
    def set_api_key(self, api_key: str):
        """
        API 키 설정 함수
        
        Args:
            api_key: Google Gemini API 키
        """
        self.api_key = api_key
        if api_key:
            self.headers = {
                'Content-Type': 'application/json',
                'X-goog-api-key': api_key
            }
            print("Gemini API 키가 설정되었습니다.")
        else:
            self.headers = None
            print("API 키가 해제되었습니다.")

    def load_model(self, model_path: str):
        """
        호환성을 위한 함수 (Gemini API 사용 시 불필요)
        
        Args:
            model_path: 모델 파일 경로
        """
        print(f"Gemini API 기반 분류기는 별도 모델 로딩이 불필요합니다.")
    
    def encode_image_to_base64(self, image_bytes: bytes) -> Optional[str]:
        """
        이미지 바이트를 base64로 인코딩
        
        Args:
            image_bytes (bytes): 이미지 바이트 데이터
            
        Returns:
            Optional[str]: base64로 인코딩된 이미지 데이터
        """
        try:
            encoded_string = base64.b64encode(image_bytes).decode('utf-8')
            return encoded_string
        except Exception as e:
            print(f"이미지 인코딩 오류: {e}")
            return None

    def get_image_mime_type(self, filename: str) -> str:
        """
        파일명으로부터 MIME 타입 결정
        
        Args:
            filename (str): 파일명
            
        Returns:
            str: MIME 타입
        """
        extension = os.path.splitext(filename)[1].lower()
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        return mime_types.get(extension, 'image/jpeg')
    
    def preprocess_image(self, image_path: str) -> torch.Tensor:
        """
        호환성을 위한 이미지 전처리 함수
        
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

    def parse_classification_response(self, response_text: str) -> Dict[str, str]:
        """
        분류 응답에서 특정 섹션의 내용을 추출
        
        Args:
            response_text (str): Gemini API 응답 텍스트
            
        Returns:
            Dict[str, str]: 파싱된 섹션별 내용
        """
        parsed_data = {}
        
        # 각 섹션을 추출하는 정규표현식 패턴
        patterns = {
            "곤충_이름": r"🐛\s*곤충\s*이름\s*:\s*(.+?)(?=🐛\s*곤충\s*이름\(영문\)|📚|$)",
            "곤충_이름_영문": r"🐛\s*곤충\s*이름\(영문\)\s*:\s*(.+?)(?=📚|$)",
            "곤충_종류": r"📚\s*곤충\s*종류\s*:\s*(.+?)(?=✨|$)",
            "특별한_모습": r"✨\s*특별한\s*모습\s*:\s*(.+?)(?=🏡|$)",
            "서식지": r"🏡\s*어디에\s*살까\s*:\s*(.+?)(?=🍽️|$)",
            "먹이": r"🍽️\s*무엇을\s*먹을까\s*:\s*(.+?)(?=🎯|$)",
            "재미있는_점": r"🎯\s*재미있는\s*점\s*:\s*(.+?)(?=😊|$)",
            "친구_되는_법": r"😊\s*친구가\s*되려면\s*:\s*(.+?)(?=\n\n|$)"
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, response_text, re.DOTALL | re.IGNORECASE)
            if match:
                content = match.group(1).strip()
                # 대괄호 안의 내용만 추출 (있는 경우)
                bracket_match = re.search(r'\[([^\]]+)\]', content)
                if bracket_match:
                    parsed_data[key] = bracket_match.group(1).strip()
                else:
                    parsed_data[key] = content
            else:
                parsed_data[key] = ""
        
        # 특별 처리: 곤충_이름에 영문이 함께 있는 경우 분리
        if "곤충_이름" in parsed_data and not parsed_data.get("곤충_이름_영문"):
            korean_name = parsed_data["곤충_이름"]
            # 영문 이름이 한국어 이름과 함께 있는지 확인
            english_match = re.search(r'🐛\s*곤충\s*이름\(영문\)\s*:\s*(.+)', korean_name)
            if english_match:
                # 영문 이름 추출
                english_name = english_match.group(1).strip()
                bracket_match = re.search(r'\[([^\]]+)\]', english_name)
                if bracket_match:
                    parsed_data["곤충_이름_영문"] = bracket_match.group(1).strip()
                else:
                    parsed_data["곤충_이름_영문"] = english_name
                
                # 한국어 이름에서 영문 부분 제거
                korean_only = re.sub(r'\n🐛\s*곤충\s*이름\(영문\)\s*:.*', '', korean_name).strip()
                parsed_data["곤충_이름"] = korean_only
        
        return parsed_data
    
    async def classify(self, image_path: str) -> Dict:
        """
        곤충 분류 메인 함수
        
        Args:
            image_path: 분류할 이미지 파일 경로
            
        Returns:
            분류 결과 딕셔너리
        """
        try:
            # Gemini API가 설정되어 있으면 실제 분류 수행
            if self.api_key and self.headers:
                # 이미지 파일 읽기
                with open(image_path, 'rb') as f:
                    image_bytes = f.read()
                
                # Gemini API로 분류 수행
                result = self.classify_insect_for_kids(image_bytes, os.path.basename(image_path))
                
                # 기존 형식에 맞춰 결과 변환
                if "success" in result and result["success"]:
                    parsed_data = result.get("parsed_data", {})
                    return {
                        "predicted_class": parsed_data.get("곤충_이름", "알 수 없는 곤충"),
                        "confidence": 0.95,  # Gemini API는 확률을 제공하지 않으므로 고정값
                        "classification": result["classification"],
                        "parsed_data": parsed_data,
                        "processing_time": "실제 처리 시간",
                        "model_version": "Gemini-2.0-flash",
                        "status": "success"
                    }
                else:
                    return {
                        "predicted_class": "분류 실패",
                        "confidence": 0.0,
                        "error": result.get("error", "알 수 없는 오류"),
                        "status": "error"
                    }
            else:
                # API 키가 없으면 더미 결과 생성
                result = await self._generate_dummy_result()
                return result
            
        except Exception as e:
            raise Exception(f"곤충 분류 중 오류 발생: {e}")

    def classify_insect_for_kids(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        """
        어린이를 위한 곤충 분류 및 설명 제공
        
        Args:
            image_bytes (bytes): 분석할 이미지 바이트
            filename (str): 파일명
            
        Returns:
            Dict[str, Any]: 분류 결과와 설명
        """
        # 이미지를 base64로 인코딩
        encoded_image = self.encode_image_to_base64(image_bytes)
        if not encoded_image:
            return {"error": "이미지를 읽을 수 없습니다."}
        
        # MIME 타입 결정
        mime_type = self.get_image_mime_type(filename)
        
        # 어린이용 프롬프트
        kid_friendly_prompt = """안녕! 나는 곤충 박사야! 🐛 
이 사진에 있는 곤충 친구를 알아보자!

다음처럼 쉽고 재미있게 설명해줄게:

🐛 곤충 이름: [곤충의 이름 (쉬운 한국어로)]
🐛 곤충 이름(영문): [곤충의 이름 (영문으로)]
📚 곤충 종류: [어떤 종류의 곤충인지 쉽게 설명]
✨ 특별한 모습: [어떻게 생겼는지, 색깔이나 모양 등을 재미있게 설명]
🏡 어디에 살까: [어디서 만날 수 있는지]
🍽️ 무엇을 먹을까: [무엇을 좋아해서 먹는지]
🎯 재미있는 점: [이 곤충의 신기하고 재미있는 특징]
😊 친구가 되려면: [이 곤충과 친하게 지내는 방법이나 주의할 점]

만약 곤충이 아니라면, "어? 이건 곤충이 아니야! 이것은 [무엇인지]이야~" 라고 친근하게 설명해줘.

모든 설명은 10살 어린이가 쉽게 이해할 수 있도록 간단하고 재미있게 해줘. 무서운 표현은 피하고 긍정적이고 호기심을 자극하는 방식으로 설명해줘! 이모지도 적절히 사용해서 더 재미있게 만들어줘."""
        
        # API 요청 데이터 구성
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": kid_friendly_prompt
                        },
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": encoded_image
                            }
                        }
                    ]
                }
            ]
        }
        
        try:
            # API 호출
            response = requests.post(
                self.base_url,
                headers=self.headers,
                data=json.dumps(payload)
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # 응답에서 텍스트 추출
                if 'candidates' in result and len(result['candidates']) > 0:
                    content = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # 응답 파싱해서 구조화된 데이터 생성
                    parsed_data = self.parse_classification_response(content)
                    
                    return {
                        "success": True,
                        "classification": content,  # 전체 응답
                        "parsed_data": parsed_data,  # 파싱된 구조화 데이터
                        "filename": filename
                    }
                else:
                    return {"error": "API 응답에서 결과를 찾을 수 없습니다."}
            else:
                return {
                    "error": f"API 호출 실패: {response.status_code}",
                    "details": response.text
                }
                
        except Exception as e:
            return {"error": f"요청 중 오류 발생: {str(e)}"}
    
    async def _generate_dummy_result(self) -> Dict:
        """
        더미 분류 결과 생성 (개발/테스트용)
        API 키가 없을 때 사용
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
            "processing_time": "1.2초 (더미 모드)",
            "model_version": "v1.0_dummy",
            "status": "success"
        }
    
    def get_model_info(self) -> Dict:
        """
        모델 정보 반환
        """
        return {
            "model_name": "KidsInsectClassifier",
            "api_based": True,
            "api_key_set": self.api_key is not None,
            "classes": self.classes,
            "device": str(self.device),
            "num_classes": len(self.classes),
            "input_size": "Variable (Gemini API)",
            "model_version": "Gemini-2.0-flash" if self.api_key else "Dummy Mode"
        }
