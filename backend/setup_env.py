"""
가상환경 설정 및 패키지 설치 자동화 스크립트
팀원들이 쉽게 개발환경을 구성할 수 있도록 도와주는 스크립트

사용법:
python setup_env.py

주요 기능:
1. 가상환경 생성 확인
2. 필요한 패키지 설치
3. 환경 설정 확인
"""

import subprocess
import sys
import os

def run_command(command):
    """명령어 실행 함수"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ 성공: {command}")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ 실패: {command}")
        print(f"오류: {e.stderr}")
        return None

def check_python_version():
    """Python 버전 확인"""
    version = sys.version_info
    print(f"Python 버전: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 이상이 필요합니다.")
        return False
    
    print("✅ Python 버전이 적합합니다.")
    return True

def setup_virtual_environment():
    """가상환경 설정"""
    print("\n" + "="*50)
    print("🔧 가상환경 설정 중...")
    print("="*50)
    
    # 가상환경이 이미 활성화되어 있는지 확인
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✅ 가상환경이 이미 활성화되어 있습니다.")
        return True
    
    # venv 디렉토리가 있는지 확인
    if os.path.exists('venv'):
        print("✅ 가상환경 폴더가 이미 존재합니다.")
        print("💡 가상환경을 활성화하려면:")
        print("   Windows: venv\\Scripts\\activate")
        print("   Linux/Mac: source venv/bin/activate")
        return True
    
    # 가상환경 생성
    print("🔨 가상환경 생성 중...")
    if run_command("python -m venv venv"):
        print("✅ 가상환경이 성공적으로 생성되었습니다.")
        print("💡 가상환경을 활성화하려면:")
        print("   Windows: venv\\Scripts\\activate")
        print("   Linux/Mac: source venv/bin/activate")
        return True
    
    return False

def install_requirements():
    """필요한 패키지 설치"""
    print("\n" + "="*50)
    print("📦 패키지 설치 중...")
    print("="*50)
    
    if not os.path.exists('requirements.txt'):
        print("❌ requirements.txt 파일을 찾을 수 없습니다.")
        return False
    
    # pip 업그레이드
    print("🔄 pip 업그레이드 중...")
    run_command("python -m pip install --upgrade pip")
    
    # requirements.txt 설치
    print("📋 requirements.txt 패키지 설치 중...")
    if run_command("pip install -r requirements.txt"):
        print("✅ 모든 패키지가 성공적으로 설치되었습니다.")
        return True
    
    return False

def check_installation():
    """설치 확인"""
    print("\n" + "="*50)
    print("🔍 설치 확인 중...")
    print("="*50)
    
    # 주요 패키지 확인
    packages_to_check = [
        "fastapi",
        "uvicorn", 
        "torch",
        "torchvision",
        "PIL"
    ]
    
    all_installed = True
    for package in packages_to_check:
        try:
            __import__(package)
            print(f"✅ {package} 설치됨")
        except ImportError:
            print(f"❌ {package} 설치되지 않음")
            all_installed = False
    
    return all_installed

def create_test_directories():
    """필요한 디렉토리 생성"""
    print("\n" + "="*50)
    print("📁 디렉토리 생성 중...")
    print("="*50)
    
    directories = ["uploads", "models", "logs"]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ {directory}/ 디렉토리 생성")

def main():
    """메인 설정 함수"""
    print("🐛 곤충 분류 및 캐릭터 변환 프로젝트 환경 설정")
    print("="*60)
    
    # Python 버전 확인
    if not check_python_version():
        return
    
    # 가상환경 설정
    setup_virtual_environment()
    
    # 패키지 설치
    install_requirements()
    
    # 설치 확인
    if check_installation():
        print("\n🎉 환경 설정이 완료되었습니다!")
    else:
        print("\n⚠️  일부 패키지 설치에 문제가 있습니다.")
        print("수동으로 다음 명령어를 실행해보세요:")
        print("pip install -r requirements.txt")
    
    # 디렉토리 생성
    create_test_directories()
    
    print("\n" + "="*60)
    print("🚀 서버 실행 방법:")
    print("1. 가상환경 활성화:")
    print("   Windows: venv\\Scripts\\activate")
    print("   Linux/Mac: source venv/bin/activate")
    print("2. 서버 실행:")
    print("   python run_server.py")
    print("   또는")
    print("   uvicorn main:app --reload")
    print("="*60)

if __name__ == "__main__":
    main()
