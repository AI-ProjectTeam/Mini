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
  color: #003300;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 18px;
  color: #003300;
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
  background: #ffffff;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
`;

const NotebookCard = styled.div`
  background: #ffffff;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  text-align: center;
`;

const NotebookCardHeader = styled.div`
  background: #f8f9fa;
  padding: 16px 24px;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const NotebookCardBinding = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #2c3e50, #34495e);
  border-radius: 50%;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
  }
`;

const NotebookCardTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #003300;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NotebookCardContent = styled.div`
  padding: 24px;
  background: repeating-linear-gradient(
    transparent,
    transparent 19px,
    #f0f0f0 20px
  );
  min-height: 200px;
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: #fffacd;
  border-radius: 8px;
  border-left: 4px solid #ffd700;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: rotate(-1deg);
  position: relative;
  
  &:nth-child(even) {
    transform: rotate(1deg);
    background: #f0f8ff;
    border-left-color: #87ceeb;
  }
  
  &:nth-child(3n) {
    transform: rotate(0.5deg);
    background: #f5f5dc;
    border-left-color: #daa520;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoSectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #003300;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
`;

const InfoSectionText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #003300;
  font-weight: 400;
  text-align: left;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #003300;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  margin: 0 auto 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  color: #003300;
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
  justify-content: flex-start;
  align-items: flex-start;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #003300;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  gap: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
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
  color: #003300;
  
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
  justify-content: center;
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

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(45deg, #CD853F, #D2691E);
  color: white;
  box-shadow: 0 4px 15px rgba(205, 133, 63, 0.4);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(205, 133, 63, 0.6);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: linear-gradient(45deg, #228B22, #32CD32);
  color: white;
  box-shadow: 0 4px 15px rgba(34, 139, 34, 0.4);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 139, 34, 0.6);
  }
`;

const StatsSection = styled.div`
  background: #ffffff;
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
  background: #ffffff;
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
  color: #003300;
`;


const NoResultMessage = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: #003300;
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

  // 백엔드 API 응답 구조에 맞게 데이터 파싱
  const apiResponse = result || {};
  const displayResult = apiResponse.data || {};
  const isSuccess = apiResponse.success === true;

  // 디버깅용 로그
  console.log('Result 페이지 데이터:', {
    result,
    apiResponse,
    displayResult,
    isSuccess
  });

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
   * 결과가 없거나 실패했을 때의 화면
   */
  if (!result || !isSuccess) {
    const errorMessage = apiResponse.error || "처리 결과가 없습니다. 다시 이미지를 업로드해주세요.";
    
    return (
      <ResultContainer>
        <NoResultMessage>
          <Title style={{ fontSize: '28px' }}>
            {!result ? "결과를 찾을 수 없습니다" : "분석에 실패했습니다"}
          </Title>
          <p>{errorMessage}</p>
          <Link to="/upload" style={{ textDecoration: 'none', marginTop: '24px', display: 'inline-block' }}>
            <PrimaryButton>
              <FaUpload />
              새로 업로드하기
            </PrimaryButton>
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
    const insectName = displayResult.곤충_이름 || '알 수 없는 곤충';
    
    if (navigator.share) {
      navigator.share({
        title: '곤충 분석 결과',
        text: `AI가 분석한 곤충: ${insectName}`,
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
      <Title>🐛 곤충 분석 결과</Title>
      <Subtitle>
        {displayResult.곤충_이름 ? 
          `${displayResult.곤충_이름} 친구에 대해 알아볼까요?` : 
          'AI가 곤충을 분석하고 있어요!'
        }
      </Subtitle>

      <ResultGrid>
        {/* 원본 이미지 */}
        <ResultCard>
          <CardTitle>
            <FaBug />
            내 친구 정보
          </CardTitle>
          {originalImageUrl && (
            <ImageContainer>
              <ResultImage src={originalImageUrl} alt="원본 곤충 이미지" />
            </ImageContainer>
          )}
          
          {/* 분류 결과 또는 분석 중 메시지 */}
          {isSuccess ? (
            displayResult.곤충_이름 ? (
            <ClassificationResults>
              <MainResult>
                <MainResultTitle>
                  <FaCheckCircle />
                  분석 결과
                </MainResultTitle>
                <MainResultText>
                  {displayResult.곤충_이름}
                  {displayResult.곤충_이름_영문 && ` (${displayResult.곤충_이름_영문})`}
                </MainResultText>
                <ConfidenceBar>
                  <ConfidenceFill confidence={0.95} />
                </ConfidenceBar>
                <p style={{ color: '#003300', fontSize: '14px', marginTop: '8px' }}>
                  AI 분석 완료 ✨
                </p>
              </MainResult>

              {displayResult.곤충_종류 && (
                <OtherResults>
                  <h4 style={{ color: '#003300', marginBottom: '12px' }}>
                    곤충 정보:
                  </h4>
                  <OtherResultItem>
                    <span style={{ fontWeight: '600', minWidth: '60px' }}>이름:</span>
                    <span style={{ textAlign: 'left' }}>
                      {displayResult.곤충_이름}
                      {displayResult.곤충_이름_영문 && (
                        <span style={{ color: '#666', fontSize: '12px', marginLeft: '8px' }}>
                          ({displayResult.곤충_이름_영문})
                        </span>
                      )}
                    </span>
                  </OtherResultItem>
                  <OtherResultItem>
                    <span style={{ fontWeight: '600', minWidth: '60px' }}>종류:</span>
                    <span style={{ fontSize: '13px', lineHeight: '1.4', textAlign: 'left' }}>
                      {displayResult.곤충_종류}
                    </span>
                  </OtherResultItem>
                </OtherResults>
              )}
            </ClassificationResults>
            ) : (
              <ClassificationResults>
                <MainResult>
                  <MainResultTitle>
                    <FaClock />
                    분석 진행 중...
                  </MainResultTitle>
                  <MainResultText>곤충 친구를 분석하고 있어요! 잠시만 기다려주세요.</MainResultText>
                </MainResult>
              </ClassificationResults>
            )
          ) : null}
        </ResultCard>

        {/* 곤충 상세 정보 */}
        {isSuccess && displayResult.곤충_이름 && (
          <NotebookCard>
            <NotebookCardHeader>
              <NotebookCardBinding></NotebookCardBinding>
              <NotebookCardTitle>
                <FaMagic />
                내 친구에 대해 더 알아봐요
              </NotebookCardTitle>
            </NotebookCardHeader>
            
            <NotebookCardContent>
              {displayResult.특별한_모습 && (
                <InfoSection>
                  <InfoSectionTitle>✨ 특별한 모습</InfoSectionTitle>
                  <InfoSectionText>{displayResult.특별한_모습}</InfoSectionText>
                </InfoSection>
              )}
              
              {displayResult.서식지 && (
                <InfoSection>
                  <InfoSectionTitle>🏡 어디에 살까</InfoSectionTitle>
                  <InfoSectionText>{displayResult.서식지}</InfoSectionText>
                </InfoSection>
              )}
              
              {displayResult.먹이 && (
                <InfoSection>
                  <InfoSectionTitle>🍽️ 무엇을 먹을까</InfoSectionTitle>
                  <InfoSectionText>{displayResult.먹이}</InfoSectionText>
                </InfoSection>
              )}
              
              {displayResult.재미있는_점 && (
                <InfoSection>
                  <InfoSectionTitle>🎯 재미있는 점</InfoSectionTitle>
                  <InfoSectionText>{displayResult.재미있는_점}</InfoSectionText>
                </InfoSection>
              )}
              
              {displayResult.친구_되는_법 && (
                <InfoSection>
                  <InfoSectionTitle>😊 친구가 되려면</InfoSectionTitle>
                  <InfoSectionText>{displayResult.친구_되는_법}</InfoSectionText>
                </InfoSection>
              )}
              
              {/* 데이터가 부족할 때 안내 메시지 */}
              {(!displayResult.특별한_모습 && !displayResult.서식지 && !displayResult.먹이 && !displayResult.재미있는_점 && !displayResult.친구_되는_법) && (
                <InfoSection>
                  <InfoSectionTitle>🤔 정보 수집 중...</InfoSectionTitle>
                  <InfoSectionText>
                    {displayResult.곤충_이름}에 대한 더 자세한 정보를 준비하고 있어요! 
                    곧 더 많은 재미있는 이야기를 들려드릴게요. 🌟
                  </InfoSectionText>
                </InfoSection>
              )}
            </NotebookCardContent>
          </NotebookCard>
        )}
      </ResultGrid>

 

      {/* 액션 버튼들 */}
      <ActionButtons>
        <SecondaryButton onClick={() => navigate('/')}>
          <FaHome />
          홈
        </SecondaryButton>
        
        <SecondaryButton onClick={() => navigate('/upload')}>
          <FaUpload />
          새로 업로드
        </SecondaryButton>
        
        {result.character?.character_image_path && (
          <PrimaryButton 
            onClick={() => handleDownload(
              `http://localhost:8000/${result.character.character_image_path}`,
              'character.png'
            )}
          >
            <FaDownload />
            캐릭터 다운로드
          </PrimaryButton>
        )}
      </ActionButtons>
    </ResultContainer>
  );
}

export default Result;
