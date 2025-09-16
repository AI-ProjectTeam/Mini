/**
 * 업로드 페이지 컴포넌트
 * 이미지 업로드 및 AI 처리 요청을 담당
 * 
 * 주요 기능:
 * 1. 드래그 앤 드롭 이미지 업로드
 * 2. 파일 선택 업로드
 * 3. 이미지 미리보기
 * 4. AI 처리 옵션 선택
 * 5. 처리 진행 상태 표시
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { FaUpload, FaImage, FaTimes, FaBug, FaMagic, FaRocket } from 'react-icons/fa';

import { 
  validateImageFile, 
  createImagePreviewUrl, 
  revokeImagePreviewUrl,
  classifyInsect,
  generateCharacter,
  processFullPipeline
} from '../services/api';

const UploadContainer = styled.div`
  padding: 40px 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
`;

const UploadCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
`;

const DropZone = styled.div`
  border: 3px dashed ${props => props.isDragActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragActive ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const DropZoneIcon = styled(FaUpload)`
  font-size: 48px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
`;

const DropZoneText = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  font-weight: 500;
`;

const DropZoneSubtext = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

const PreviewSection = styled.div`
  margin-top: 32px;
`;

const PreviewCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const ImageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(244, 67, 54, 0.8);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(244, 67, 54, 1);
    transform: scale(1.1);
  }
`;

const ProcessingOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 32px 0;
`;

const OptionButton = styled.button`
  padding: 20px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: ${props => props.selected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OptionIcon = styled.div`
  font-size: 32px;
`;

const OptionTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const OptionDescription = styled.div`
  font-size: 12px;
  opacity: 0.8;
  text-align: center;
`;

const ProcessButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #ffcdd2;
  margin-top: 16px;
  text-align: center;
`;

function Upload({ serverConnected }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processingOption, setProcessingOption] = useState('full'); // 'classify', 'character', 'full'
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');

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
    setError('');
    
    // 파일 유효성 검사
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.message);
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
    setError('');
  };

  /**
   * AI 처리 실행
   */
  const handleProcess = async () => {
    if (!selectedFile || !serverConnected) {
      setError('파일을 선택하고 서버 연결을 확인해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      
      switch (processingOption) {
        case 'classify':
          setLoadingMessage('곤충 분류 중...');
          result = await classifyInsect(selectedFile);
          break;
        case 'character':
          setLoadingMessage('캐릭터 생성 중...');
          result = await generateCharacter(selectedFile);
          break;
        case 'full':
        default:
          setLoadingMessage('AI 분석 및 캐릭터 생성 중...');
          result = await processFullPipeline(selectedFile);
          break;
      }

      // 결과 페이지로 이동
      navigate('/result', { 
        state: { 
          result: result.data,
          originalFile: selectedFile,
          processingOption 
        } 
      });

    } catch (error) {
      console.error('처리 중 오류:', error);
      setError(error.message || '처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  /**
   * 파일 크기를 읽기 쉬운 형태로 변환
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <UploadContainer>
      <Title>이미지 업로드</Title>
      <Subtitle>곤충 사진을 업로드하여 AI 분석을 시작하세요</Subtitle>

      <UploadCard>
        {!selectedFile ? (
          <DropZone {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <DropZoneIcon />
            <DropZoneText>
              {isDragActive 
                ? '이곳에 파일을 놓아주세요' 
                : '이미지를 드래그하거나 클릭하여 업로드'}
            </DropZoneText>
            <DropZoneSubtext>
              JPG, PNG, BMP, GIF 파일 지원 (최대 10MB)
            </DropZoneSubtext>
          </DropZone>
        ) : (
          <PreviewSection>
            <PreviewCard>
              <RemoveButton onClick={handleRemoveFile}>
                <FaTimes />
              </RemoveButton>
              <PreviewImage src={previewUrl} alt="업로드된 이미지" />
              <ImageInfo>
                <span>
                  <FaImage style={{ marginRight: '8px' }} />
                  {selectedFile.name}
                </span>
                <span>{formatFileSize(selectedFile.size)}</span>
              </ImageInfo>
            </PreviewCard>
          </PreviewSection>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </UploadCard>

      {selectedFile && (
        <>
          <UploadCard>
            <Title style={{ fontSize: '24px', marginBottom: '24px' }}>
              처리 옵션 선택
            </Title>
            
            <ProcessingOptions>
              <OptionButton
                selected={processingOption === 'classify'}
                onClick={() => setProcessingOption('classify')}
                disabled={!serverConnected}
              >
                <OptionIcon><FaBug /></OptionIcon>
                <OptionTitle>곤충 분류만</OptionTitle>
                <OptionDescription>곤충 종류만 분류합니다</OptionDescription>
              </OptionButton>

              <OptionButton
                selected={processingOption === 'character'}
                onClick={() => setProcessingOption('character')}
                disabled={!serverConnected}
              >
                <OptionIcon><FaMagic /></OptionIcon>
                <OptionTitle>캐릭터 생성만</OptionTitle>
                <OptionDescription>캐릭터만 생성합니다</OptionDescription>
              </OptionButton>

              <OptionButton
                selected={processingOption === 'full'}
                onClick={() => setProcessingOption('full')}
                disabled={!serverConnected}
              >
                <OptionIcon><FaRocket /></OptionIcon>
                <OptionTitle>전체 처리</OptionTitle>
                <OptionDescription>분류 + 캐릭터 생성</OptionDescription>
              </OptionButton>
            </ProcessingOptions>

            <ProcessButton
              onClick={handleProcess}
              disabled={!selectedFile || !serverConnected || loading}
            >
              {loading ? (
                <>
                  <div className="loading" />
                  처리 중...
                </>
              ) : (
                <>
                  <FaRocket />
                  AI 처리 시작
                </>
              )}
            </ProcessButton>

            {!serverConnected && (
              <ErrorMessage>
                서버에 연결되지 않았습니다. 백엔드 서버를 먼저 실행해주세요.
              </ErrorMessage>
            )}
          </UploadCard>
        </>
      )}

      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>{loadingMessage}</LoadingText>
          <LoadingSubtext>잠시만 기다려주세요...</LoadingSubtext>
        </LoadingOverlay>
      )}
    </UploadContainer>
  );
}

export default Upload;
