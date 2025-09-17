/**
 * 업로드 페이지 컴포넌트
 * Figma 디자인에 맞춘 심플한 업로드 인터페이스
 * 
 * 주요 기능:
 * 1. 곤충 친구 사진 올리기 (이미지 업로드)
 * 2. 내 곤충 친구의 정보를 알려줘~ (분류하기)
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { FaUpload, FaSearch, FaImage, FaTimes, FaKey } from 'react-icons/fa';
import ApiKeyModal from '../components/ApiKeyModal';

import { 
  validateImageFile, 
  createImagePreviewUrl, 
  revokeImagePreviewUrl,
  classifyInsect,
  generateCharacter,
  processFullPipeline,
  classifyInsectSimple
} from '../services/api';

const UploadContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
  position: relative;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
  max-width: 1400px;
  width: 100%;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 50px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const WelcomeTitle = styled.h2`
  font-size: 36px;
  color: #FF6B35;
  font-family: 'Jua', sans-serif !important;
  text-align: center;
  margin-bottom: 25px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const GuideText = styled.p`
  font-size: 22px;
  color: #8B4513;
  line-height: 1.6;
  margin-bottom: 35px;
  font-weight: 500;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 30px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const FunFactBox = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 30px;
  margin-top: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 3px solid rgba(255, 107, 53, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 24px;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const FunFactTitle = styled.h3`
  font-size: 22px;
  color: #CD853F;
  font-family: 'Jua', sans-serif !important;
  margin: 0 0 15px 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const FunFactText = styled.p`
  font-size: 18px;
  color: #8B4513;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadSectionTitle = styled.h3`
  font-size: 30px;
  color: #CD853F;
  font-family: 'Jua', sans-serif !important;
  margin: 0 0 25px 0;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 15px;
  }
`;

const ImageUploadArea = styled.div`
  width: 450px;
  height: 350px;
  background: rgba(255, 255, 255, 0.8);
  border: 4px dashed ${props => props.isDragActive ? '#4CAF50' : '#8B4513'};
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 45px;
  
  &:hover {
    border-color: #CD853F;
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    width: 400px;
    height: 320px;
  }
  
  @media (max-width: 480px) {
    width: 350px;
    height: 280px;
  }
`;

const UploadIcon = styled(FaUpload)`
  font-size: 64px;
  color: #8B4513;
  margin-bottom: 20px;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 56px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 48px;
  }
`;

const UploadText = styled.p`
  font-size: 20px;
  color: #8B4513;
  text-align: center;
  font-weight: 500;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const UploadHint = styled.p`
  font-size: 16px;
  color: #CD853F;
  text-align: center;
  font-weight: 400;
  margin: 0;
  opacity: 0.8;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
`;

const ActionButton = styled.button`
  padding: 20px 40px;
  border: none;
  border-radius: 50px;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Jua', sans-serif !important;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  justify-content: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 18px 36px;
    font-size: 18px;
    min-width: 180px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 32px;
    font-size: 17px;
    min-width: 160px;
  }
`;

const UploadButton = styled(ActionButton)`
  background: linear-gradient(45deg, #CD853F, #D2691E);
  color: white;
  box-shadow: 0 4px 15px rgba(205, 133, 63, 0.4);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(205, 133, 63, 0.6);
  }
`;

const ClassifyButton = styled(ActionButton)`
  background: linear-gradient(45deg, #228B22, #32CD32);
  color: white;
  box-shadow: 0 4px 15px rgba(34, 139, 34, 0.4);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 139, 34, 0.6);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(244, 67, 54, 0.8);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 12px;
  
  &:hover {
    background: rgba(244, 67, 54, 1);
    transform: scale(1.1);
  }
`;

const StatusText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #8B4513;
  margin-top: 20px;
  font-weight: 500;
`;

const EncouragementBox = styled.div`
  margin-top: 35px;
  padding: 20px 30px;
  background: linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(205, 133, 63, 0.1));
  border-radius: 30px;
  border: 3px solid rgba(255, 107, 53, 0.2);
  animation: gentle-pulse 3s ease-in-out infinite;
  
  @keyframes gentle-pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.02); opacity: 1; }
  }
  
  @media (max-width: 768px) {
    margin-top: 25px;
    padding: 16px 24px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 20px;
  }
`;

const EncouragementText = styled.p`
  font-size: 18px;
  color: #CD853F;
  font-family: 'Jua', sans-serif !important;
  text-align: center;
  margin: 0;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 22px;
  text-align: center;
  margin-bottom: 12px;
  font-family: 'Jua', sans-serif !important;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const LoadingSubtext = styled.p`
  font-size: 18px;
  opacity: 0.8;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

// 물결 애니메이션 컴포넌트들
const WaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60vh;
  pointer-events: none;
  z-index: 1;
  
  @media (max-width: 768px) {
    height: 50vh;
  }
  
  @media (max-width: 480px) {
    height: 45vh;
  }
`;

const Wave = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  clip-path: polygon(
    0% 100%,
    0% 80%,
    10% 75%,
    20% 80%,
    30% 70%,
    40% 75%,
    50% 65%,
    60% 70%,
    70% 60%,
    80% 65%,
    90% 55%,
    100% 60%,
    100% 100%
  );
  animation: wave-flow 8s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90%;
    background: rgba(255, 255, 255, 0.25);
    clip-path: polygon(
      0% 100%,
      0% 85%,
      15% 82%,
      25% 87%,
      35% 78%,
      45% 83%,
      55% 74%,
      65% 79%,
      75% 70%,
      85% 75%,
      95% 66%,
      100% 71%,
      100% 100%
    );
    animation: wave-flow 12s ease-in-out infinite reverse;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80%;
    background: rgba(255, 255, 255, 0.35);
    clip-path: polygon(
      0% 100%,
      0% 90%,
      12% 88%,
      22% 92%,
      32% 84%,
      42% 88%,
      52% 80%,
      62% 84%,
      72% 76%,
      82% 80%,
      92% 72%,
      100% 76%,
      100% 100%
    );
    animation: wave-flow 10s ease-in-out infinite;
    animation-delay: -2s;
  }
  
  @keyframes wave-flow {
    0%, 100% {
      clip-path: polygon(
        0% 100%,
        0% 80%,
        10% 75%,
        20% 80%,
        30% 70%,
        40% 75%,
        50% 65%,
        60% 70%,
        70% 60%,
        80% 65%,
        90% 55%,
        100% 60%,
        100% 100%
      );
    }
    50% {
      clip-path: polygon(
        0% 100%,
        0% 75%,
        10% 80%,
        20% 70%,
        30% 75%,
        40% 65%,
        50% 70%,
        60% 60%,
        70% 65%,
        80% 55%,
        90% 60%,
        100% 50%,
        100% 100%
      );
    }
  }
`;

const FloatingBubbles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
`;

const Bubble = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  animation: bubble-float ${props => props.duration || '6s'} ease-in-out infinite;
  
  @keyframes bubble-float {
    0% {
      transform: translateY(100vh) scale(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      transform: translateY(50vh) scale(1) rotate(180deg);
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) scale(0.5) rotate(360deg);
      opacity: 0;
    }
  }
  
  &:nth-child(1) {
    left: 8%;
    width: 24px;
    height: 24px;
    animation-delay: 0s;
    animation-duration: 8s;
  }
  
  &:nth-child(2) {
    left: 18%;
    width: 18px;
    height: 18px;
    animation-delay: 2s;
    animation-duration: 10s;
  }
  
  &:nth-child(3) {
    left: 32%;
    width: 30px;
    height: 30px;
    animation-delay: 4s;
    animation-duration: 7s;
  }
  
  &:nth-child(4) {
    left: 48%;
    width: 22px;
    height: 22px;
    animation-delay: 6s;
    animation-duration: 9s;
  }
  
  &:nth-child(5) {
    left: 65%;
    width: 26px;
    height: 26px;
    animation-delay: 8s;
    animation-duration: 11s;
  }
  
  &:nth-child(6) {
    left: 78%;
    width: 20px;
    height: 20px;
    animation-delay: 10s;
    animation-duration: 6s;
  }
  
  &:nth-child(7) {
    left: 90%;
    width: 16px;
    height: 16px;
    animation-delay: 12s;
    animation-duration: 8s;
  }
  
  &:nth-child(8) {
    left: 25%;
    width: 14px;
    height: 14px;
    animation-delay: 14s;
    animation-duration: 9s;
  }
  
  &:nth-child(9) {
    left: 55%;
    width: 28px;
    height: 28px;
    animation-delay: 16s;
    animation-duration: 7s;
  }
  
  &:nth-child(10) {
    left: 75%;
    width: 12px;
    height: 12px;
    animation-delay: 18s;
    animation-duration: 10s;
  }
`;

function Upload({ serverConnected }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  /**
   * 드래그 앤 드롭 핸들러
   */
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.gif']
    },
    maxFiles: 1
  });

  /**
   * 파일 선택 처리
   */
  const handleFileSelect = (file) => {
    // 파일 유효성 검사
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // 이전 미리보기 URL 해제
    if (previewUrl) {
      revokeImagePreviewUrl(previewUrl);
    }

    // 새 파일 설정
    setSelectedFile(file);
    setPreviewUrl(createImagePreviewUrl(file));
  };

  /**
   * 파일 제거
   */
  const handleRemoveFile = () => {
    if (previewUrl) {
      revokeImagePreviewUrl(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  /**
   * API 키 설정 성공 후 처리
   */
  const handleApiKeySuccess = () => {
    setShowApiKeyModal(false);
    // API 키 설정 후 자동으로 분류 재시도
    if (selectedFile) {
      handleClassify();
    }
  };

  /**
   * 파일 업로드 버튼 클릭
   */
  const handleUploadClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  /**
   * 분류하기 처리
   */
  const handleClassify = async () => {
    if (!selectedFile) {
      alert('먼저 곤충 사진을 업로드해주세요.');
      return;
    }

    if (!serverConnected) {
      alert('서버에 연결되지 않았습니다. 백엔드 서버를 먼저 실행해주세요.');
      return;
    }

    setLoading(true);
    setLoadingMessage('곤충 친구의 정보를 분석중입니다...');

    try {
      // 제미나이 AI를 사용한 상세 곤충 분류
      const result = await classifyInsectSimple(selectedFile);

      // 결과 페이지로 이동
      navigate('/result', { 
        state: { 
          result: result.data,
          originalFile: selectedFile,
          processingOption: 'gemini'
        } 
      });

    } catch (error) {
      console.error('처리 중 오류:', error);
      
      // API 키 관련 오류인 경우 모달 표시
      if (error.message.includes('API 키가 설정되지 않았습니다')) {
        setShowApiKeyModal(true);
      } else {
        alert(error.message || '처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <UploadContainer>
      {/* 물결 애니메이션 배경 */}
      <WaveContainer>
        <Wave />
      </WaveContainer>
      
      {/* 떠오르는 거품 효과 */}
      <FloatingBubbles>
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
      </FloatingBubbles>
      
      <MainContent>
        <LeftSection>
          <WelcomeTitle>🌟 곤충 친구들을 만나볼까요? 🌟</WelcomeTitle>
          <GuideText>
            사진을 올려주면 어떤 곤충 친구인지 알려드릴게요!<br/>
            그리고 귀여운 캐릭터로도 변신시켜 드려요 ✨
          </GuideText>
          <FunFactBox>
            <FunFactTitle>🐛 재미있는 곤충 이야기</FunFactTitle>
            <FunFactText>
              나비는 발로 맛을 느낄 수 있어요!<br/>
              무당벌레의 점은 나이가 아니라 종류를 나타내요 🐞
            </FunFactText>
          </FunFactBox>
        </LeftSection>

        <RightSection>
          <UploadSectionTitle>📸 곤충 친구 사진 올리기</UploadSectionTitle>
          <ImageUploadArea {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            {selectedFile ? (
              <>
                <RemoveButton onClick={handleRemoveFile}>
                  <FaTimes />
                </RemoveButton>
                <PreviewImage src={previewUrl} alt="업로드된 이미지" />
              </>
            ) : (
              <>
                <UploadIcon />
                <UploadText>
                  {isDragActive 
                    ? '🎉 이곳에 곤충 친구를 불러오세요!' 
                    : '📷 곤충 사진을 드래그하거나 클릭해주세요'}
                </UploadText>
                <UploadHint>
                  🌈 나비, 무당벌레, 사슴벌레... 어떤 친구든 좋아요!
                </UploadHint>
              </>
            )}
          </ImageUploadArea>

          <ButtonContainer>
            <UploadButton onClick={handleUploadClick} disabled={loading}>
              <FaUpload />
              데려오기
            </UploadButton>
            
            <ClassifyButton 
              onClick={handleClassify} 
              disabled={!selectedFile || !serverConnected || loading}
            >
              <FaSearch />
              알아보기
            </ClassifyButton>
          </ButtonContainer>

          <div style={{ marginTop: '20px', textAlign: 'center', display: 'none' }}>
            {/* API 키 설정 버튼 - 필요시 display: 'block'으로 변경 */}
            <button
              onClick={() => setShowApiKeyModal(true)}
              style={{
                background: 'none',
                border: '1px solid #8B4513',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#8B4513',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#8B4513';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#8B4513';
              }}
            >
              <FaKey />
              API 키 설정
            </button>
          </div>

          {!serverConnected && (
            <StatusText>
              ⚠️ 서버 연결을 확인해주세요
            </StatusText>
          )}
          
          <EncouragementBox>
            <EncouragementText>
              🌟 곤충들은 지구의 소중한 친구들이에요! 🌟
            </EncouragementText>
          </EncouragementBox>
        </RightSection>
      </MainContent>

      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>{loadingMessage}</LoadingText>
          <LoadingSubtext>잠시만 기다려주세요...</LoadingSubtext>
        </LoadingOverlay>
      )}

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSuccess={handleApiKeySuccess}
      />
    </UploadContainer>
  );
}

export default Upload;
