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
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1000px;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const GuideText = styled.p`
  font-size: 18px;
  color: #8B4513;
  line-height: 1.6;
  margin-bottom: 40px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageUploadArea = styled.div`
  width: 350px;
  height: 280px;
  background: rgba(255, 255, 255, 0.8);
  border: 3px dashed ${props => props.isDragActive ? '#4CAF50' : '#8B4513'};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 40px;
  
  &:hover {
    border-color: #CD853F;
    background: rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    width: 300px;
    height: 240px;
  }
  
  @media (max-width: 480px) {
    width: 280px;
    height: 220px;
  }
`;

const UploadIcon = styled(FaUpload)`
  font-size: 48px;
  color: #8B4513;
  margin-bottom: 16px;
  opacity: 0.7;
`;

const UploadText = styled.p`
  font-size: 16px;
  color: #8B4513;
  text-align: center;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
`;

const ActionButton = styled.button`
  padding: 16px 32px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 14px 24px;
    font-size: 15px;
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
  z-index: 2000;
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
  font-size: 18px;
  text-align: center;
  margin-bottom: 8px;
`;

const LoadingSubtext = styled.p`
  font-size: 14px;
  opacity: 0.8;
  text-align: center;
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
      <MainContent>
        <LeftSection>
          <GuideText>
           애기들을 위한 후후후
          </GuideText>
        </LeftSection>

        <RightSection>
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
                    ? '이곳에 파일을 놓아주세요' 
                    : '곤충 사진을 드래그하거나 클릭해주세요'}
                </UploadText>
              </>
            )}
          </ImageUploadArea>

          <ButtonContainer>
            <UploadButton onClick={handleUploadClick} disabled={loading}>
              <FaUpload />
              곤충 친구 사진 올리기
            </UploadButton>
            
            <ClassifyButton 
              onClick={handleClassify} 
              disabled={!selectedFile || !serverConnected || loading}
            >
              <FaSearch />
              내 곤충 친구의 정보를 알려줘~
            </ClassifyButton>
          </ButtonContainer>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
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
