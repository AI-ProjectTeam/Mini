"""
백엔드-프론트엔드 통합 테스트 스크립트
양쪽 서버가 정상적으로 작동하고 통신하는지 확인

사용법:
1. 백엔드 서버 실행: cd backend && python run_server.py
2. 프론트엔드 서버 실행: cd frontend && npm start  
3. 이 스크립트 실행: python test_integration.py
"""

import requests
import time
import subprocess
import sys
import os

def test_backend_server():
    """백엔드 서버 테스트"""
    print("🔍 백엔드 서버 테스트 중...")
    
    backend_url = "http://localhost:8000"
    
    try:
        # 기본 엔드포인트 테스트
        response = requests.get(f"{backend_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ 백엔드 서버 기본 응답 성공")
            print(f"   응답: {response.json().get('message', '')}")
        else:
            print(f"❌ 백엔드 서버 응답 오류: {response.status_code}")
            return False
            
        # 헬스 체크 테스트
        response = requests.get(f"{backend_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ 백엔드 헬스 체크 성공")
            health_data = response.json()
            print(f"   서버 상태: {health_data.get('server', 'unknown')}")
        else:
            print(f"❌ 헬스 체크 실패: {response.status_code}")
            return False
            
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ 백엔드 서버에 연결할 수 없습니다.")
        print("   백엔드 서버가 실행 중인지 확인하세요: cd backend && python run_server.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ 백엔드 서버 응답 시간 초과")
        return False
    except Exception as e:
        print(f"❌ 백엔드 테스트 중 오류: {e}")
        return False

def test_frontend_server():
    """프론트엔드 서버 테스트"""
    print("\n🔍 프론트엔드 서버 테스트 중...")
    
    frontend_url = "http://localhost:3000"
    
    try:
        response = requests.get(frontend_url, timeout=10)
        if response.status_code == 200:
            print("✅ 프론트엔드 서버 접근 성공")
            if "곤충" in response.text or "insect" in response.text.lower():
                print("   앱 콘텐츠가 정상적으로 로드됨")
            return True
        else:
            print(f"❌ 프론트엔드 서버 응답 오류: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ 프론트엔드 서버에 연결할 수 없습니다.")
        print("   프론트엔드 서버가 실행 중인지 확인하세요: cd frontend && npm start")
        return False
    except requests.exceptions.Timeout:
        print("❌ 프론트엔드 서버 응답 시간 초과")
        return False
    except Exception as e:
        print(f"❌ 프론트엔드 테스트 중 오류: {e}")
        return False

def test_cors_communication():
    """CORS 통신 테스트"""
    print("\n🔍 CORS 통신 테스트 중...")
    
    try:
        # 프론트엔드에서 백엔드로의 요청 시뮬레이션
        headers = {
            'Origin': 'http://localhost:3000',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            "http://localhost:8000/health", 
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            print("✅ CORS 통신 성공")
            # CORS 헤더 확인
            cors_headers = response.headers.get('Access-Control-Allow-Origin')
            if cors_headers:
                print(f"   CORS 헤더: {cors_headers}")
            return True
        else:
            print(f"❌ CORS 통신 실패: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ CORS 테스트 중 오류: {e}")
        return False

def check_file_structure():
    """프로젝트 파일 구조 확인"""
    print("\n🔍 프로젝트 파일 구조 확인 중...")
    
    required_files = [
        "backend/main.py",
        "backend/requirements.txt",
        "backend/run_server.py",
        "frontend/package.json",
        "frontend/src/App.js",
        "frontend/public/index.html"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if not missing_files:
        print("✅ 모든 필수 파일이 존재합니다")
        return True
    else:
        print("❌ 누락된 파일들:")
        for file in missing_files:
            print(f"   - {file}")
        return False

def check_dependencies():
    """의존성 확인"""
    print("\n🔍 의존성 확인 중...")
    
    # Python 패키지 확인
    try:
        import fastapi
        import uvicorn
        import torch
        print("✅ Python 의존성 확인 완료")
        python_deps = True
    except ImportError as e:
        print(f"❌ Python 의존성 누락: {e}")
        print("   해결: cd backend && pip install -r requirements.txt")
        python_deps = False
    
    # Node.js 패키지 확인
    node_deps = os.path.exists("frontend/node_modules")
    if node_deps:
        print("✅ Node.js 의존성 확인 완료")
    else:
        print("❌ Node.js 의존성 누락")
        print("   해결: cd frontend && npm install")
    
    return python_deps and node_deps

def run_integration_test():
    """통합 테스트 실행"""
    print("🚀 곤충 캐릭터 변환기 통합 테스트 시작")
    print("=" * 60)
    
    # 1. 파일 구조 확인
    structure_ok = check_file_structure()
    
    # 2. 의존성 확인  
    deps_ok = check_dependencies()
    
    # 3. 백엔드 테스트
    backend_ok = test_backend_server()
    
    # 4. 프론트엔드 테스트
    frontend_ok = test_frontend_server()
    
    # 5. CORS 통신 테스트
    cors_ok = test_cors_communication()
    
    # 결과 요약
    print("\n" + "=" * 60)
    print("📊 테스트 결과 요약")
    print("=" * 60)
    
    tests = [
        ("파일 구조", structure_ok),
        ("의존성", deps_ok), 
        ("백엔드 서버", backend_ok),
        ("프론트엔드 서버", frontend_ok),
        ("CORS 통신", cors_ok)
    ]
    
    passed = 0
    for test_name, result in tests:
        status = "✅ 통과" if result else "❌ 실패"
        print(f"{test_name:12} : {status}")
        if result:
            passed += 1
    
    print(f"\n총 {passed}/{len(tests)}개 테스트 통과")
    
    if passed == len(tests):
        print("\n🎉 모든 테스트가 성공했습니다!")
        print("팀원들이 프로젝트를 시작할 준비가 완료되었습니다.")
        print("\n📋 다음 단계:")
        print("1. AI 모델 개발 (backend/services/ 폴더)")
        print("2. UI/UX 개선 (frontend/src/ 폴더)")
        print("3. 추가 기능 구현")
    else:
        print(f"\n⚠️  {len(tests) - passed}개 테스트가 실패했습니다.")
        print("위의 오류들을 해결한 후 다시 테스트해주세요.")
        
        print("\n🔧 문제 해결 가이드:")
        if not deps_ok:
            print("- 의존성 설치: cd backend && pip install -r requirements.txt")
            print("- 의존성 설치: cd frontend && npm install")
        if not backend_ok:
            print("- 백엔드 실행: cd backend && python run_server.py")
        if not frontend_ok:
            print("- 프론트엔드 실행: cd frontend && npm start")
    
    return passed == len(tests)

if __name__ == "__main__":
    success = run_integration_test()
    sys.exit(0 if success else 1)
