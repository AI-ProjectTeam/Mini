#!/usr/bin/env python3
"""
Google Cloud Text-to-Speech 테스트 스크립트
설정이 올바른지 확인하는 용도
"""

import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

def test_google_tts():
    """Google Cloud TTS 설정 테스트"""
    print("🔍 Google Cloud Text-to-Speech 설정 테스트")
    print("=" * 50)
    
    # 환경변수 확인
    credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    print(f"📁 GOOGLE_APPLICATION_CREDENTIALS: {credentials_path}")
    
    if not credentials_path:
        print("❌ 환경변수가 설정되지 않았습니다.")
        print("💡 .env 파일에 GOOGLE_APPLICATION_CREDENTIALS를 설정하세요.")
        return False
    
    # 키 파일 존재 확인
    if not os.path.exists(credentials_path):
        print(f"❌ 키 파일을 찾을 수 없습니다: {credentials_path}")
        print("💡 Google Cloud Console에서 다운로드한 JSON 키 파일을 올바른 경로에 복사하세요.")
        return False
    
    print(f"✅ 키 파일 존재 확인: {credentials_path}")
    
    # Google Cloud TTS 라이브러리 테스트
    try:
        from google.cloud import texttospeech
        print("✅ google-cloud-texttospeech 패키지 로드 성공")
    except ImportError as e:
        print(f"❌ 패키지 로드 실패: {e}")
        print("💡 pip install google-cloud-texttospeech 를 실행하세요.")
        return False
    
    # 클라이언트 초기화 테스트
    try:
        client = texttospeech.TextToSpeechClient()
        print("✅ Google Cloud TTS 클라이언트 초기화 성공")
    except Exception as e:
        print(f"❌ 클라이언트 초기화 실패: {e}")
        print("💡 인증 설정을 확인하세요.")
        return False
    
    # 음성 목록 조회 테스트
    try:
        voices = client.list_voices(language_code='ko-KR')
        korean_voices = [v for v in voices.voices if 'ko' in v.language_codes[0]]
        print(f"✅ 한국어 음성 {len(korean_voices)}개 발견:")
        for voice in korean_voices[:3]:  # 처음 3개만 표시
            print(f"   - {voice.name} ({voice.ssml_gender.name})")
    except Exception as e:
        print(f"❌ 음성 목록 조회 실패: {e}")
        print("💡 API 권한을 확인하세요.")
        return False
    
    # 간단한 음성 생성 테스트
    try:
        synthesis_input = texttospeech.SynthesisInput(text="안녕하세요! 테스트입니다.")
        voice = texttospeech.VoiceSelectionParams(
            language_code='ko-KR',
            name=korean_voices[0].name if korean_voices else 'ko-KR-Standard-A'
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        
        # 테스트 파일 저장
        with open("test_voice.mp3", "wb") as out:
            out.write(response.audio_content)
        
        print("✅ 음성 생성 테스트 성공!")
        print("📁 test_voice.mp3 파일이 생성되었습니다.")
        
    except Exception as e:
        print(f"❌ 음성 생성 테스트 실패: {e}")
        return False
    
    print("\n🎉 모든 테스트 통과! Google Cloud TTS가 정상 작동합니다.")
    return True

if __name__ == "__main__":
    test_google_tts()
