/**
 * 결과 페이지 컴포넌트
 * AI 처리 결과를 표시하는 페이지
 * 
 * 주요 기능:
 * 1. 분류 결과 표시
 * 2. 생성된 캐릭터 표시
 * 3. 원본 이미지와 비교
 * 4. 결과 다운로드
 * 5. 새로운 처리 시작
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaDownload, 
  FaUpload, 
  FaBug, 
  FaMagic, 
  FaShare, 
  FaHome,
  FaCheckCircle,
  FaClock,
  FaPalette
} from 'react-icons/fa';

const ResultContainer = styled.div`
  padding: 40px 24px;
  max-width: 1200px;
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

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ImageContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 0 auto 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
`;

const ResultImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ClassificationResults = styled.div`
  text-align: left;
  margin-top: 24px;
`;

const MainResult = styled.div`
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.4);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const MainResultTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MainResultText = styled.p`
  font-size: 18px;
  color: white;
  font-weight: 500;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-top: 12px;
  overflow: hidden;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  width: ${props => props.confidence * 100}%;
  transition: width 1s ease-out;
`;

const OtherResults = styled.div`
  margin-top: 20px;
`;

const OtherResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
`;

const CharacterInfo = styled.div`
  text-align: left;
  margin-top: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  font-size: 16px;
  color: #667eea;
  width: 20px;
`;

const InfoText = styled.span`
  flex: 1;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
`;

const ActionButton = styled.button`
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &.primary {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const NoResultMessage = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: rgba(255, 255, 255, 0.8);
`;

const NoResultIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
`;

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  const result = location.state?.result;
  const originalFile = location.state?.originalFile;
  const processingOption = location.state?.processingOption;

  useEffect(() => {
    // 원본 이미지 URL 생성
    if (originalFile) {
      const url = URL.createObjectURL(originalFile);
      setOriginalImageUrl(url);
      
      // 컴포넌트 언마운트 시 URL 해제
      return () => URL.revokeObjectURL(url);
    }
  }, [originalFile]);

  /**
   * 결과가 없을 때의 화면
   */
  if (!result) {
    return (
      <ResultContainer>
        <NoResultMessage>
          <NoResultIcon>🤔</NoResultIcon>
          <Title style={{ fontSize: '28px' }}>결과를 찾을 수 없습니다</Title>
          <p>처리 결과가 없습니다. 다시 이미지를 업로드해주세요.</p>
          <Link to="/upload" style={{ textDecoration: 'none', marginTop: '24px', display: 'inline-block' }}>
            <ActionButton className="primary">
              <FaUpload />
              새로 업로드하기
            </ActionButton>
          </Link>
        </NoResultMessage>
      </ResultContainer>
    );
  }

  /**
   * 이미지 다운로드
   */
  const handleDownload = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('다운로드 중 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  /**
   * 결과 공유
   */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '곤충 캐릭터 변환 결과',
        text: `AI가 분석한 곤충: ${result.classification?.predicted_class || '알 수 없음'}`,
        url: window.location.href,
      });
    } else {
      // 브라우저가 Web Share API를 지원하지 않는 경우
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <ResultContainer>
      <Title>처리 결과</Title>
      <Subtitle>AI 분석이 완료되었습니다! 🎉</Subtitle>

      <ResultGrid>
        {/* 원본 이미지 */}
        <ResultCard>
          <CardTitle>
            <FaBug />
            원본 이미지
          </CardTitle>
          {originalImageUrl && (
            <ImageContainer>
              <ResultImage src={originalImageUrl} alt="원본 곤충 이미지" />
            </ImageContainer>
          )}
          
          {/* 분류 결과 */}
          {result.classification && (
            <ClassificationResults>
              <MainResult>
                <MainResultTitle>
                  <FaCheckCircle />
                  분류 결과
                </MainResultTitle>
                <MainResultText>{result.classification.predicted_class}</MainResultText>
                <ConfidenceBar>
                  <ConfidenceFill confidence={result.classification.confidence} />
                </ConfidenceBar>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px' }}>
                  신뢰도: {(result.classification.confidence * 100).toFixed(1)}%
                </p>
              </MainResult>

              {result.classification.all_predictions && (
                <OtherResults>
                  <h4 style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
                    다른 가능성:
                  </h4>
                  {result.classification.all_predictions.slice(1, 4).map((pred, index) => (
                    <OtherResultItem key={index}>
                      <span>{pred.class}</span>
                      <span>{(pred.confidence * 100).toFixed(1)}%</span>
                    </OtherResultItem>
                  ))}
                </OtherResults>
              )}
            </ClassificationResults>
          )}
        </ResultCard>

        {/* 생성된 캐릭터 */}
        {result.character && (
          <ResultCard>
            <CardTitle>
              <FaMagic />
              생성된 캐릭터
            </CardTitle>
            {result.character.character_image_path && (
              <ImageContainer>
                <ResultImage 
                  src={`http://localhost:8000/${result.character.character_image_path}`} 
                  alt="생성된 캐릭터" 
                />
              </ImageContainer>
            )}
            
            <CharacterInfo>
              <InfoItem>
                <InfoIcon><FaPalette /></InfoIcon>
                <InfoText>스타일: {result.character.style_applied}</InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon><FaClock /></InfoIcon>
                <InfoText>생성 시간: {result.character.generation_time}</InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon><FaMagic /></InfoIcon>
                <InfoText>모델: {result.character.model_version}</InfoText>
              </InfoItem>
            </CharacterInfo>

            {result.character.character_description && (
              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {result.character.character_description}
              </div>
            )}
          </ResultCard>
        )}
      </ResultGrid>

      {/* 통계 정보 */}
      <StatsSection>
        <CardTitle style={{ marginBottom: '0' }}>
          <FaCheckCircle />
          처리 통계
        </CardTitle>
        <StatsGrid>
          {result.classification && (
            <StatItem>
              <StatValue>{(result.classification.confidence * 100).toFixed(1)}%</StatValue>
              <StatLabel>분류 정확도</StatLabel>
            </StatItem>
          )}
          {result.processing_time && (
            <StatItem>
              <StatValue>{result.processing_time}</StatValue>
              <StatLabel>처리 시간</StatLabel>
            </StatItem>
          )}
          <StatItem>
            <StatValue>{processingOption === 'full' ? '전체' : processingOption === 'classify' ? '분류' : '캐릭터'}</StatValue>
            <StatLabel>처리 모드</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>성공</StatValue>
            <StatLabel>처리 상태</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      {/* 액션 버튼들 */}
      <ActionButtons>
        {result.character?.character_image_path && (
          <ActionButton 
            className="primary"
            onClick={() => handleDownload(
              `http://localhost:8000/${result.character.character_image_path}`,
              'character.png'
            )}
          >
            <FaDownload />
            캐릭터 다운로드
          </ActionButton>
        )}
        
        <ActionButton className="secondary" onClick={handleShare}>
          <FaShare />
          결과 공유
        </ActionButton>
        
        <ActionButton className="secondary" onClick={() => navigate('/upload')}>
          <FaUpload />
          새로 업로드
        </ActionButton>
        
        <ActionButton className="secondary" onClick={() => navigate('/')}>
          <FaHome />
          홈으로
        </ActionButton>
      </ActionButtons>
    </ResultContainer>
  );
}

export default Result;
