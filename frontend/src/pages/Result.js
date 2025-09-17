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
  FaPalette,
  FaVolumeUp,
  FaStop
} from 'react-icons/fa';
import { 
  generateAIVoice 
} from '../services/api';

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
  position: relative;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const UploadButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const CharacterButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 135px;
  margin-top: auto;
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
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
  height: 300px;
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

const VoiceButton = styled(PrimaryButton)`
  background: linear-gradient(45deg, #9C27B0, #7B1FA2);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(156, 39, 176, 0.6);
  }
  
  &.playing {
    background: linear-gradient(45deg, #f44336, #d32f2f);
    box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
    
    &:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(244, 67, 54, 0.6);
    }
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
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const result = location.state?.result;
  const originalFile = location.state?.originalFile;
  const processingOption = location.state?.processingOption;

  // 백엔드 API 응답 구조에 맞게 데이터 파싱
  const apiResponse = result || {};
  const displayResult = apiResponse.data || {};
  const isSuccess = apiResponse.success === true;
  
  // 곤충이 아닌지 확인하는 함수
  const isNotInsect = (text) => {
    if (!text) return false;
    const notInsectKeywords = [
      '곤충이 아니', '곤충이 아님', '곤충이 아닙니다', 
      '이건 곤충이 아니', '곤충이 아니야', '곤충이 아니에요',
      '어? 이건 곤충이 아니야', '이건 곤충이 아니야!',
      '곤충이 아닌', '곤충이 아니라', '곤충이 아니네',
      'not an insect', 'not a bug', 'not insect'
    ];
    return notInsectKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };
  
  // 곤충이 아닌지 확인 (더 넓은 범위로 검사)
  const isNotInsectResult = isNotInsect(displayResult.곤충_이름) || 
                           isNotInsect(displayResult.곤충_종류) ||
                           isNotInsect(apiResponse.error) ||
                           isNotInsect(apiResponse.classification) || // 전체 분류 응답 확인
                           isNotInsect(JSON.stringify(displayResult));

  // 디버깅용 로그
  console.log('Result 페이지 데이터:', {
    result,
    apiResponse,
    displayResult,
    isSuccess,
    isNotInsectResult,
    // 곤충이 아닌지 감지 상세 정보
    classification_text: apiResponse.classification,
    insect_name_check: isNotInsect(displayResult.곤충_이름),
    insect_type_check: isNotInsect(displayResult.곤충_종류),
    error_check: isNotInsect(apiResponse.error),
    classification_check: isNotInsect(apiResponse.classification)
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

  useEffect(() => {
    // 컴포넌트 언마운트 시 음성 정지
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  /**
   * AI 음성 원버튼 핸들러 (재생/정지)
   */
  const handleVoiceToggle = async () => {
    // 현재 재생 중이면 정지
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }

    // 음성 생성 및 재생
    try {
      setIsGeneratingVoice(true);
      
      const response = await generateAIVoice(displayResult);
      
      if (response.success && response.data.success) {
        const audioUrl = `http://localhost:8000${response.data.audio_url}`;
        const audio = new Audio(audioUrl);
        
        audio.onloadstart = () => {
          setIsPlaying(true);
          setCurrentAudio(audio);
        };
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          alert('음성 재생 중 오류가 발생했습니다.');
        };
        
        await audio.play();
        
      } else {
        alert(response.data.error || 'AI 음성 생성에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('AI 음성 오류:', error);
      alert('음성 기능을 사용할 수 없습니다.');
    } finally {
      setIsGeneratingVoice(false);
    }
  };

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
      <Title>곤충 분석 결과</Title>
      <Subtitle>
        {displayResult.곤충_이름 ? 
          `${displayResult.곤충_이름} 친구에 대해 알아볼까요?` : 
          'AI가 곤충을 분석하고 있어요!'
        }
      </Subtitle>

      <ResultGrid style={isNotInsectResult ? { gridTemplateColumns: '1fr', justifyItems: 'center', position: 'relative' } : {}}>
        {/* 🎨 곤충이 아닐 때만 - 박스 밖 CSS 애니메이션 효과들 추가 */}
        {isNotInsectResult && (
          <>
            {/* 🌊 떠다니는 원들 애니메이션 */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              width: '20px',
              height: '20px',
              background: 'linear-gradient(45deg, rgba(255, 193, 7, 0.4), rgba(255, 165, 0, 0.6))',
              borderRadius: '50%',
              animation: 'float 3s ease-in-out infinite',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              top: '25%',
              right: '15%',
              width: '15px',
              height: '15px',
              background: 'linear-gradient(45deg, rgba(255, 140, 0, 0.5), rgba(255, 193, 7, 0.3))',
              borderRadius: '50%',
              animation: 'float 4s ease-in-out infinite 0.5s',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '20%',
              width: '12px',
              height: '12px',
              background: 'linear-gradient(45deg, rgba(255, 165, 0, 0.6), rgba(255, 140, 0, 0.4))',
              borderRadius: '50%',
              animation: 'float 3.5s ease-in-out infinite 1s',
              zIndex: 1
            }}></div>
            
            {/* ✨ 펄스 효과 원들 */}
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '5%',
              width: '25px',
              height: '25px',
              background: 'rgba(255, 193, 7, 0.2)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              bottom: '35%',
              right: '8%',
              width: '18px',
              height: '18px',
              background: 'rgba(255, 140, 0, 0.3)',
              borderRadius: '50%',
              animation: 'pulse 2.5s ease-in-out infinite 1s',
              zIndex: 1
            }}></div>
            
            {/* 🌟 회전하는 별 모양들 */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '25%',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '14px solid rgba(255, 193, 7, 0.4)',
              animation: 'rotate 6s linear infinite, float 3s ease-in-out infinite',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '30%',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '10px solid rgba(255, 165, 0, 0.5)',
              animation: 'rotate 8s linear infinite reverse, float 4s ease-in-out infinite 2s',
              zIndex: 1
            }}></div>
            
            {/* 🜻 CSS로 만든 진짜 잠자리들이 날아다니는 애니메이션 */}
            {/* 잠자리 1 */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '-60px',
              animation: 'flyAcross1 8s linear infinite',
              zIndex: 1
            }}>
              <div style={{
                width: '30px',
                height: '4px',
                background: 'linear-gradient(90deg, #4CAF50, #2E7D32)',
                borderRadius: '2px',
                position: 'relative'
              }}>
                {/* 날개들 */}
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '8px',
                  width: '12px',
                  height: '8px',
                  background: 'rgba(135, 206, 235, 0.6)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(-20deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '8px',
                  width: '12px',
                  height: '8px',
                  background: 'rgba(135, 206, 235, 0.6)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(20deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '8px',
                  width: '12px',
                  height: '8px',
                  background: 'rgba(135, 206, 235, 0.6)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(20deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '8px',
                  width: '12px',
                  height: '8px',
                  background: 'rgba(135, 206, 235, 0.6)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(-20deg)'
                }}></div>
              </div>
            </div>
            
            {/* 잠자리 2 */}
            <div style={{
              position: 'absolute',
              top: '60%',
              right: '-60px',
              animation: 'flyAcross2 10s linear infinite 3s',
              zIndex: 1
            }}>
              <div style={{
                width: '25px',
                height: '3px',
                background: 'linear-gradient(90deg, #FF9800, #F57C00)',
                borderRadius: '2px',
                position: 'relative'
              }}>
                {/* 날개들 */}
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '6px',
                  width: '10px',
                  height: '7px',
                  background: 'rgba(255, 193, 7, 0.5)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(-25deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  left: '6px',
                  width: '10px',
                  height: '7px',
                  background: 'rgba(255, 193, 7, 0.5)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(25deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '6px',
                  width: '10px',
                  height: '7px',
                  background: 'rgba(255, 193, 7, 0.5)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(25deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  right: '6px',
                  width: '10px',
                  height: '7px',
                  background: 'rgba(255, 193, 7, 0.5)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(-25deg)'
                }}></div>
              </div>
            </div>
            
            {/* 잠자리 3 */}
            <div style={{
              position: 'absolute',
              top: '35%',
              left: '-50px',
              animation: 'flyAcross3 12s linear infinite 6s',
              zIndex: 1
            }}>
              <div style={{
                width: '20px',
                height: '3px',
                background: 'linear-gradient(90deg, #9C27B0, #7B1FA2)',
                borderRadius: '2px',
                position: 'relative'
              }}>
                {/* 날개들 */}
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '5px',
                  width: '8px',
                  height: '6px',
                  background: 'rgba(186, 104, 200, 0.4)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(-30deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  left: '5px',
                  width: '8px',
                  height: '6px',
                  background: 'rgba(186, 104, 200, 0.4)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(30deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '5px',
                  width: '8px',
                  height: '6px',
                  background: 'rgba(186, 104, 200, 0.4)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(30deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  right: '5px',
                  width: '8px',
                  height: '6px',
                  background: 'rgba(186, 104, 200, 0.4)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(-30deg)'
                }}></div>
              </div>
            </div>
            
            {/* 잠자리 4 */}
            <div style={{
              position: 'absolute',
              bottom: '25%',
              right: '-55px',
              animation: 'flyAcross4 9s linear infinite 1.5s',
              zIndex: 1
            }}>
              <div style={{
                width: '28px',
                height: '4px',
                background: 'linear-gradient(90deg, #E91E63, #C2185B)',
                borderRadius: '2px',
                position: 'relative'
              }}>
                {/* 날개들 */}
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '7px',
                  width: '11px',
                  height: '8px',
                  background: 'rgba(240, 98, 146, 0.5)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(-22deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '7px',
                  width: '11px',
                  height: '8px',
                  background: 'rgba(240, 98, 146, 0.5)',
                  borderRadius: '50% 20%',
                  transform: 'rotate(22deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '7px',
                  width: '11px',
                  height: '8px',
                  background: 'rgba(240, 98, 146, 0.5)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(22deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '7px',
                  width: '11px',
                  height: '8px',
                  background: 'rgba(240, 98, 146, 0.5)',
                  borderRadius: '20% 50%',
                  transform: 'rotate(-22deg)'
                }}></div>
              </div>
            </div>

            {/* 💫 키프레임 애니메이션 CSS 추가 */}
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-15px) scale(1.1); }
              }
              
              @keyframes pulse {
                0%, 100% { 
                  transform: scale(1);
                  opacity: 0.3;
                }
                50% { 
                  transform: scale(1.3);
                  opacity: 0.6;
                }
              }
              
              @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              @keyframes fadeInOut {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 0.7; }
              }
              
              /* 🜟 잠자리 날아다니기 애니메이션들 */
              @keyframes flyAcross1 {
                0% { 
                  transform: translateX(0) translateY(0) rotate(0deg);
                  opacity: 0;
                }
                10% { opacity: 0.7; }
                50% { 
                  transform: translateX(50vw) translateY(-20px) rotate(5deg);
                  opacity: 0.8;
                }
                90% { opacity: 0.7; }
                100% { 
                  transform: translateX(100vw) translateY(10px) rotate(-3deg);
                  opacity: 0;
                }
              }
              
              @keyframes flyAcross2 {
                0% { 
                  transform: translateX(0) translateY(0) rotate(180deg);
                  opacity: 0;
                }
                10% { opacity: 0.6; }
                50% { 
                  transform: translateX(-50vw) translateY(15px) rotate(175deg);
                  opacity: 0.8;
                }
                90% { opacity: 0.6; }
                100% { 
                  transform: translateX(-100vw) translateY(-10px) rotate(185deg);
                  opacity: 0;
                }
              }
              
              @keyframes flyAcross3 {
                0% { 
                  transform: translateX(0) translateY(0) rotate(-10deg) scale(0.8);
                  opacity: 0;
                }
                15% { opacity: 0.5; }
                50% { 
                  transform: translateX(60vw) translateY(-30px) rotate(0deg) scale(1);
                  opacity: 0.7;
                }
                85% { opacity: 0.5; }
                100% { 
                  transform: translateX(110vw) translateY(20px) rotate(10deg) scale(0.9);
                  opacity: 0;
                }
              }
              
              @keyframes flyAcross4 {
                0% { 
                  transform: translateX(0) translateY(0) rotate(170deg);
                  opacity: 0;
                }
                12% { opacity: 0.6; }
                50% { 
                  transform: translateX(-45vw) translateY(-25px) rotate(180deg);
                  opacity: 0.8;
                }
                88% { opacity: 0.6; }
                100% { 
                  transform: translateX(-95vw) translateY(15px) rotate(190deg);
                  opacity: 0;
                }
              }
            `}</style>
          </>
        )}
        
        {/* 원본 이미지 */}
        <ResultCard style={isNotInsectResult ? { width: 'calc((100% - 32px) / 2)', maxWidth: '584px', position: 'relative', zIndex: 2 } : {}}>
          <CardTitle>
            내 친구 정보
          </CardTitle>
          {originalImageUrl && (
            <ImageContainer>
              <ResultImage src={originalImageUrl} alt="원본 곤충 이미지" />
            </ImageContainer>
          )}
          
          {/* 업로드 버튼 - 곤충 여부에 따라 다른 텍스트 */}
          <UploadButtonContainer>
            <SecondaryButton onClick={() => navigate('/upload')}>
              <FaUpload />
              {isNotInsectResult ? '곤충 친구 데려오기' : '새로운 친구 데려오기'}
            </SecondaryButton>
          </UploadButtonContainer>
          
          {/* 분류 결과 또는 분석 중 메시지 */}
          {isSuccess ? (
            displayResult.곤충_이름 ? (
            <ClassificationResults>
              <MainResult>
                 <MainResultTitle>
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
                  AI 분석 완료
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
             ) : isNotInsectResult ? (
               <ClassificationResults>
                 {/* 📝 박스 안 텍스트 가운데 정렬 */}
                 <MainResult style={{ background: 'rgba(255, 193, 7, 0.2)', border: '1px solid rgba(255, 193, 7, 0.4)', textAlign: 'center' }}>
                   <MainResultTitle style={{ 
                     color: '#FF8C00', 
                     textAlign: 'center',
                     justifyContent: 'center',
                     display: 'flex',
                     alignItems: 'center'
                   }}>
                     곤충 친구를 찾아주세요!
                   </MainResultTitle>
                   <MainResultText style={{ textAlign: 'center' }}>
                     어? 이건 곤충 친구가 아니에요!
                     <br/><br/>
                     위에 있는 버튼을 눌러서<br/>
                     곤충 친구의 사진을 올려주세요!
                   </MainResultText>
                 </MainResult>
               </ClassificationResults>
             ) : (
               <ClassificationResults>
                 <MainResult>
                   <MainResultTitle>
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
                 내 친구에 대해 더 알아봐요
               </NotebookCardTitle>
             </NotebookCardHeader>
            
            <NotebookCardContent>
               {displayResult.특별한_모습 && (
                 <InfoSection>
                   <InfoSectionTitle>특별한 모습</InfoSectionTitle>
                   <InfoSectionText>{displayResult.특별한_모습}</InfoSectionText>
                 </InfoSection>
               )}
               
               {displayResult.서식지 && (
                 <InfoSection>
                   <InfoSectionTitle>어디에 살까</InfoSectionTitle>
                   <InfoSectionText>{displayResult.서식지}</InfoSectionText>
                 </InfoSection>
               )}
               
               {displayResult.먹이 && (
                 <InfoSection>
                   <InfoSectionTitle>무엇을 먹을까</InfoSectionTitle>
                   <InfoSectionText>{displayResult.먹이}</InfoSectionText>
                 </InfoSection>
               )}
               
               {displayResult.재미있는_점 && (
                 <InfoSection>
                   <InfoSectionTitle>재미있는 점</InfoSectionTitle>
                   <InfoSectionText>{displayResult.재미있는_점}</InfoSectionText>
                 </InfoSection>
               )}
               
               {displayResult.친구_되는_법 && (
                 <InfoSection>
                   <InfoSectionTitle>친구가 되려면</InfoSectionTitle>
                   <InfoSectionText>{displayResult.친구_되는_법}</InfoSectionText>
                 </InfoSection>
               )}
              
              {/* 데이터가 부족할 때 안내 메시지 */}
               {(!displayResult.특별한_모습 && !displayResult.서식지 && !displayResult.먹이 && !displayResult.재미있는_점 && !displayResult.친구_되는_법) && (
                 <InfoSection>
                   <InfoSectionTitle>정보 수집 중...</InfoSectionTitle>
                   <InfoSectionText>
                     {displayResult.곤충_이름}에 대한 더 자세한 정보를 준비하고 있어요! 
                     곧 더 많은 재미있는 이야기를 들려드릴게요.
                   </InfoSectionText>
                 </InfoSection>
               )}
             </NotebookCardContent>
             
             {/* 캐릭터로 만들기 버튼 & AI 음성 버튼 - 박스 하단 오른쪽 */}
             <CharacterButtonContainer>
               {!isGeneratingVoice && (
                 <VoiceButton 
                   onClick={handleVoiceToggle}
                   disabled={isGeneratingVoice}
                   className={isPlaying ? 'playing' : ''}
                   title={isPlaying ? "음성 정지" : "곤충 설명 듣기"}
                 >
                   {isPlaying ? <FaStop /> : <FaVolumeUp />}
                   {isPlaying ? '음성 정지' : '곤충 설명 듣기'}
                 </VoiceButton>
               )}
               
               <PrimaryButton onClick={() => {
                 // 캐릭터 생성 페이지로 이동 (곤충 데이터 전달)
                 navigate('/character-generation', { 
                   state: { 
                     insectData: displayResult 
                   } 
                 });
               }}>
                 <FaMagic />
                 캐릭터로 만들기
               </PrimaryButton>
             </CharacterButtonContainer>
           </NotebookCard>
         )}
      </ResultGrid>

      {/* 액션 버튼들 */}
      <ActionButtons>
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