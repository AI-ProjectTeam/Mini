"""
음성 생성 서비스
Google Cloud Text-to-Speech API를 사용한 자연스러운 음성 생성

주요 기능:
1. 텍스트를 자연스러운 한국어 음성으로 변환
2. 어린이 친화적인 음성 설정
3. 음성 파일 저장 및 관리
4. 다양한 음성 옵션 제공

Google Cloud TTS API를 사용하여 실제 음성 생성을 수행합니다.
"""

import os
import asyncio
import tempfile
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
import json
import base64

try:
    from google.cloud import texttospeech
    GOOGLE_TTS_AVAILABLE = True
except ImportError:
    GOOGLE_TTS_AVAILABLE = False
    print("Google Cloud Text-to-Speech 패키지가 설치되지 않았습니다. pip install google-cloud-texttospeech")

class VoiceGenerator:
    """
    Google Cloud Text-to-Speech를 사용한 음성 생성 클래스
    """
    
    def __init__(self, credentials_path: str = None):
        """
        음성 생성기 초기화
        
        Args:
            credentials_path: Google Cloud 서비스 계정 JSON 키 파일 경로
        """
        self.credentials_path = credentials_path or os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        self.client = None
        self.voices_cache = []
        
        # 음성 파일 저장 디렉토리
        self.audio_dir = "audio_files"
        os.makedirs(self.audio_dir, exist_ok=True)
        
        if GOOGLE_TTS_AVAILABLE and self.credentials_path:
            try:
                # Google Cloud TTS 클라이언트 초기화
                self.client = texttospeech.TextToSpeechClient()
                print("Google Cloud Text-to-Speech 클라이언트가 초기화되었습니다.")
                
                # 사용 가능한 음성 목록 로드
                self._load_voices()
            except Exception as e:
                print(f"Google Cloud TTS 초기화 실패: {e}")
                self.client = None
        else:
            print("Google Cloud TTS를 사용할 수 없습니다. 환경 설정을 확인하세요.")
    
    def is_available(self) -> bool:
        """
        Google Cloud TTS 사용 가능 여부 확인
        """
        return GOOGLE_TTS_AVAILABLE and self.client is not None
    
    def _load_voices(self):
        """
        사용 가능한 음성 목록 로드
        """
        if not self.client:
            return
            
        try:
            voices = self.client.list_voices(language_code='ko-KR')
            self.voices_cache = [
                {
                    'name': voice.name,
                    'language_codes': voice.language_codes,
                    'ssml_gender': voice.ssml_gender.name,
                    'natural_sample_rate_hertz': voice.natural_sample_rate_hertz
                }
                for voice in voices.voices
                if 'ko' in voice.language_codes[0]
            ]
            print(f"사용 가능한 한국어 음성: {len(self.voices_cache)}개")
        except Exception as e:
            print(f"음성 목록 로드 실패: {e}")
    
    def get_available_voices(self) -> List[Dict]:
        """
        사용 가능한 한국어 음성 목록 반환
        """
        return self.voices_cache
    
    def get_recommended_voice(self) -> str:
        """
        어린이용으로 추천하는 음성 이름 반환
        """
        # 여성 음성 중에서 자연스러운 것을 선택
        female_voices = [
            voice for voice in self.voices_cache 
            if voice['ssml_gender'] == 'FEMALE'
        ]
        
        if female_voices:
            # Neural 음성이 있으면 우선 선택
            neural_voices = [v for v in female_voices if 'Neural' in v['name']]
            if neural_voices:
                return neural_voices[0]['name']
            return female_voices[0]['name']
        
        # 기본값
        return 'ko-KR-Standard-A' if self.voices_cache else None
    
    async def generate_voice(
        self, 
        text: str, 
        voice_name: str = None,
        speaking_rate: float = 1.0,
        pitch: float = 0.0,
        volume_gain_db: float = 0.0
    ) -> Dict[str, Any]:
        """
        텍스트를 음성으로 변환
        
        Args:
            text: 변환할 텍스트
            voice_name: 사용할 음성 이름 (None이면 추천 음성 사용)
            speaking_rate: 말하기 속도 (0.25 - 4.0)
            pitch: 음높이 (-20.0 - 20.0)
            volume_gain_db: 음량 (-96.0 - 16.0)
            
        Returns:
            Dict: 생성된 음성 파일 정보
        """
        if not self.is_available():
            return {
                "success": False,
                "error": "Google Cloud Text-to-Speech를 사용할 수 없습니다."
            }
        
        try:
            # 음성 설정
            if not voice_name:
                voice_name = self.get_recommended_voice()
            
            if not voice_name:
                return {
                    "success": False,
                    "error": "사용 가능한 음성이 없습니다."
                }
            
            # 텍스트 입력 설정
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # 음성 설정
            voice = texttospeech.VoiceSelectionParams(
                language_code='ko-KR',
                name=voice_name
            )
            
            # 오디오 설정
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=speaking_rate,
                pitch=pitch,
                volume_gain_db=volume_gain_db
            )
            
            # 음성 합성 요청
            response = self.client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            # 음성 파일 저장
            audio_filename = f"voice_{uuid.uuid4().hex[:8]}_{int(datetime.now().timestamp())}.mp3"
            audio_path = os.path.join(self.audio_dir, audio_filename)
            
            with open(audio_path, "wb") as audio_file:
                audio_file.write(response.audio_content)
            
            return {
                "success": True,
                "audio_filename": audio_filename,
                "audio_path": audio_path,
                "audio_url": f"/audio/{audio_filename}",
                "voice_name": voice_name,
                "text_length": len(text),
                "settings": {
                    "speaking_rate": speaking_rate,
                    "pitch": pitch,
                    "volume_gain_db": volume_gain_db
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"음성 생성 중 오류: {str(e)}"
            }
    
    async def generate_insect_voice(self, summary_text: str) -> Dict[str, Any]:
        """
        곤충 정보 요약을 어린이 친화적인 음성으로 변환
        
        Args:
            summary_text: 곤충 정보 요약 텍스트
            
        Returns:
            Dict: 생성된 음성 파일 정보
        """
        # 어린이용 최적화 설정
        return await self.generate_voice(
            text=summary_text,
            voice_name=self.get_recommended_voice(),
            speaking_rate=0.9,  # 조금 천천히
            pitch=2.0,          # 조금 높게 (어린이 친화적)
            volume_gain_db=0.0  # 기본 음량
        )
    
    def get_audio_file_path(self, filename: str) -> Optional[str]:
        """
        음성 파일의 전체 경로 반환
        
        Args:
            filename: 음성 파일명
            
        Returns:
            str: 파일 전체 경로 또는 None
        """
        audio_path = os.path.join(self.audio_dir, filename)
        if os.path.exists(audio_path):
            return audio_path
        return None
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """
        오래된 음성 파일 정리
        
        Args:
            max_age_hours: 파일 보관 시간 (시간)
        """
        try:
            import time
            current_time = time.time()
            
            for filename in os.listdir(self.audio_dir):
                if filename.endswith('.mp3'):
                    file_path = os.path.join(self.audio_dir, filename)
                    file_age = current_time - os.path.getctime(file_path)
                    
                    # 24시간 이상 된 파일 삭제
                    if file_age > (max_age_hours * 3600):
                        os.remove(file_path)
                        print(f"오래된 음성 파일 삭제: {filename}")
        except Exception as e:
            print(f"파일 정리 중 오류: {e}")
    
    def get_service_info(self) -> Dict[str, Any]:
        """
        음성 생성 서비스 정보 반환
        """
        return {
            "service_name": "Google Cloud Text-to-Speech",
            "available": self.is_available(),
            "credentials_set": self.credentials_path is not None,
            "available_voices": len(self.voices_cache),
            "recommended_voice": self.get_recommended_voice(),
            "audio_directory": self.audio_dir
        }

# 더미 음성 생성기 (Google Cloud TTS가 없을 때 사용)
class DummyVoiceGenerator:
    """
    Google Cloud TTS를 사용할 수 없을 때의 더미 구현
    """
    
    def __init__(self):
        self.audio_dir = "audio_files"
        os.makedirs(self.audio_dir, exist_ok=True)
    
    def is_available(self) -> bool:
        return False
    
    def get_available_voices(self) -> List[Dict]:
        return []
    
    def get_recommended_voice(self) -> str:
        return "dummy-voice"
    
    async def generate_voice(self, text: str, **kwargs) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "Google Cloud Text-to-Speech가 설정되지 않았습니다. 브라우저 내장 음성을 사용하세요."
        }
    
    async def generate_insect_voice(self, summary_text: str) -> Dict[str, Any]:
        return await self.generate_voice(summary_text)
    
    def get_service_info(self) -> Dict[str, Any]:
        return {
            "service_name": "Dummy Voice Generator",
            "available": False,
            "error": "Google Cloud Text-to-Speech 설정 필요"
        }
