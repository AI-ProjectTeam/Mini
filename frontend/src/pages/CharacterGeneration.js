
/**
 * 곤충 캐릭터 카드 생성 페이지 컴포넌트
 * 포켓몬 카드 스타일의 곤충 캐릭터 카드를 생성하는 페이지
 * 
 * 주요 기능:
 * 1. 자동 이미지 생성
 * 2. 포켓몬 카드 스타일 디자인
 * 3. 곤충 정보 카드 표시
 * 4. 카드 다운로드
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaDownload,
  FaSpinner,
  FaExclamationCircle,
  FaStar,
  FaLeaf,
  FaHeart,
  FaRedo,
  FaPlus,
  FaUpload
} from 'react-icons/fa';
import { generateCharacterFromInsect } from '../services/api';
import html2canvas from 'html2canvas';

const CharacterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

// 물결 애니메이션 (다른 페이지와 동일)
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
`;

// 포켓몬 카드 스타일 컴포넌트들
const MainContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 500px;
`;


const LoadingCard = styled.div`
  width: 350px;
  height: 520px;  /* 500px에서 520px로 증가 */
  background: linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%);
  border-radius: 20px;
  border: 8px solid #FFD700;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid #E6B800;
    border-radius: 12px;
    pointer-events: none;
  }
  
  @media (max-width: 480px) {
    width: 300px;
    height: 450px;  /* 430px에서 450px로 증가 */
  }
`;

const PokemonCard = styled.div`
  width: 350px;
  height: 520px;  /* 500px에서 520px로 증가 */
  background: linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%);
  border-radius: 20px;
  border: 8px solid #FFD700;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid #E6B800;
    border-radius: 12px;
    pointer-events: none;
  }
  
  @media (max-width: 480px) {
    width: 300px;
    height: 450px;  /* 430px에서 450px로 증가 */
  }
`;

const CardHeader = styled.div`
  padding: 20px 20px 10px 20px;
  text-align: center;
`;

const CardName = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #FF6B35;
  margin: 0 0 8px 0;
  font-family: 'Jua', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const TypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Jua', sans-serif;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
`;

const CardImageSection = styled.div`
  height: 180px;  /* 200px에서 220px로 증가 */
  margin: 15px 20px;
  background: radial-gradient(circle, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 15px;
  border: 3px solid #2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 480px) {
    height: 160px;  /* 160px에서 180px로 증가 */
    margin: 15px 15px;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;  /* cover에서 contain으로 변경하여 이미지가 잘리지 않도록 */
  border-radius: 12px;
`;

const CardStats = styled.div`
  padding: 0 20px 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#2196F3'};
`;

const StatLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  font-family: 'Jua', sans-serif;
`;

const StatValue = styled.span`
  font-size: 13px;
  color: #666;
  max-width: 60%;
  text-align: right;
  line-height: 1.3;
  font-family: 'Noto Sans KR', sans-serif;
`;

const RarityBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 2px;
`;

const Star = styled(FaStar)`
  color: #FFD700;
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
`;

const LoadingSpinner = styled(FaSpinner)`
  font-size: 48px;
  animation: spin 1s linear infinite;
  color: #CD853F;
  margin-bottom: 20px;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #8B4513;
  margin: 0;
  font-family: 'Jua', sans-serif;
  text-align: center;
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: #e74c3c;
  text-align: center;
`;

const ErrorIcon = styled(FaExclamationCircle)`
  font-size: 48px;
  color: #e74c3c;
`;

const ErrorText = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  font-family: 'Jua', sans-serif;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const ActionButton = styled.button`
  padding: 14px 28px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Jua', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const DownloadButton = styled(ActionButton)`
  background: linear-gradient(45deg, #CD853F, #D2691E);
  color: white;
`;

const ReleaseButton = styled(ActionButton)`
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
`;

// 새친구 데려오기 버튼 (result 페이지와 동일한 스타일, 작은 크기)
const NewFriendUploadButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Jua', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(45deg, rgb(255, 193, 127), rgb(255, 183, 77));
  color:rgb(83, 54, 0);
  box-shadow: 0 4px 15px rgba(255, 193, 127, 0.4);
  margin-bottom: 5px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 193, 127, 0.6);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 13px;
    margin-bottom: 4px;
  }
`;

// 모달 관련 스타일 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 25px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  margin: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 3px solid #4CAF50;
  position: relative;
  animation: slideUp 0.3s ease-out;
  
  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  color: #4CAF50;
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2E7D32;
  margin: 0 0 15px 0;
  font-family: 'Jua', sans-serif;
`;

const ModalMessage = styled.p`
  font-size: 18px;
  color: #388E3C;
  margin: 0 0 30px 0;
  line-height: 1.5;
  font-family: 'Jua', sans-serif;
`;

const ModalButton = styled.button`
  padding: 15px 35px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Jua', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(76, 175, 80, 0.6);
  }
`;

// 미리보기 모달 관련 스타일 컴포넌트들
const PreviewModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PreviewModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 25px;
  padding: 30px;
  text-align: center;
  max-width: 90vw;
  max-height: 90vh;
  margin: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 3px solid #FFD700;
  position: relative;
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
  
  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 2px solid #E6B800;
`;

const PreviewTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2E7D32;
  margin: 0 0 20px 0;
  font-family: 'Jua', sans-serif;
`;

const PreviewButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PreviewDownloadButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(45deg, #CD853F, #D2691E);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Jua', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(205, 133, 63, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(205, 133, 63, 0.6);
  }
`;

const PreviewCloseButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(45deg,rgb(223, 163, 0),rgb(238, 207, 34));
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Jua', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(108, 117, 125, 0.6);
  }
`;

const PreviewRegenerateButton = styled.button`
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #FF6B35, #FF8E53);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 12px 35px rgba(255, 107, 53, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FloatingHearts = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;


const Heart = styled.div`
  position: absolute;
  color: #E91E63;
  font-size: 20px;
  animation: floatUp 3s ease-out infinite;
  
  @keyframes floatUp {
    0% {
      transform: translateY(100px) scale(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translateY(-50px) scale(1);
      opacity: 0;
    }
  }
  
  &:nth-child(1) {
    left: 20%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    left: 50%;
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    left: 80%;
    animation-delay: 2s;
  }
`;

function CharacterGeneration() {
  const location = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  
  // URL에서 곤충 정보 받기
  const rawInsectData = location.state?.insectData || {};
  
  // 곤충 이름에서 영문 부분 제거 (한글만 추출)
  const extractKoreanName = (name) => {
    if (!name) return '';
    // 괄호와 그 안의 내용을 제거하고, 영문자를 제거
    return name
      .replace(/\([^)]*\)/g, '') // 괄호와 괄호 안 내용 제거
      .replace(/[a-zA-Z]/g, '') // 영문자 제거
      .replace(/\s+/g, ' ') // 여러 공백을 하나로
      .trim(); // 앞뒤 공백 제거
  };
  
  // 정제된 곤충 데이터
  const insectData = {
    ...rawInsectData,
    곤충_이름: extractKoreanName(rawInsectData.곤충_이름) || rawInsectData.곤충_이름
  };
  
  // 상태 관리
  const [, setIsGenerating] = useState(true); // 페이지 진입시 바로 생성 시작
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('generating'); // generating, success, error
  const [rarityStars, setRarityStars] = useState(3); // 희귀도 별 개수 (1~5)
  const [showReleaseModal, setShowReleaseModal] = useState(false); // 놓아주기 모달 표시 여부
  const [showPreviewModal, setShowPreviewModal] = useState(false); // 미리보기 모달 표시 여부
  const [previewImageData, setPreviewImageData] = useState(null); // 미리보기 이미지 데이터
  const [isRegenerating, setIsRegenerating] = useState(false); // 재생성 중 상태

  // 사전 생성된 이미지가 있는지 확인
  const preGeneratedImageUrl = location.state?.generatedImageUrl;
  const isPreGenerated = location.state?.preGenerated;

  // 곤충 정보가 없으면 결과 페이지로 리다이렉트
  useEffect(() => {
    if (!insectData.곤충_이름) {
      navigate('/result');
      return;
    }
    
    // 사전 생성된 이미지가 있으면 바로 표시, 없으면 생성 시작
    if (isPreGenerated && preGeneratedImageUrl) {
      setGeneratedImage(preGeneratedImageUrl);
      setGenerationStatus('success');
      setIsGenerating(false);
      
      // 랜덤 희귀도 생성
      const randomRarity = Math.floor(Math.random() * 5) + 1;
      setRarityStars(randomRarity);
    } else {
      // 페이지 진입시 자동으로 캐릭터 생성 시작
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insectData.곤충_이름, navigate, isPreGenerated, preGeneratedImageUrl]);

  // 캐릭터 생성 함수
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStatus('generating');
    setGeneratedImage(null);

    try {
      console.log('캐릭터 생성 요청:', {
        insect_name: insectData.곤충_이름_영문 || insectData.곤충_이름,
        insect_korean_name: insectData.곤충_이름,
        insect_features: {
          type: insectData.곤충_종류,
          appearance: insectData.특별한_모습,
          habitat: insectData.서식지
        }
      });
      
      // 실제 백엔드 API 호출
      const response = await generateCharacterFromInsect(insectData);
      
      if (response.success) {
        // 생성된 이미지 URL 설정
        const imageUrl = `http://localhost:8000${response.data.image_url}`;
        setGeneratedImage(imageUrl);
        
        // 랜덤 희귀도 생성 (1~5개 별)
        const randomRarity = Math.floor(Math.random() * 5) + 1;
        setRarityStars(randomRarity);
        
        setGenerationStatus('success');
      } else {
        throw new Error('캐릭터 생성에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('캐릭터 생성 실패:', error);
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  // 카드 이미지 생성 함수 (공통)
  const generateCardImage = async () => {
    try {
      console.log('카드 이미지 생성 시작...');
      
      // 카드 요소가 있는지 확인
      if (!cardRef.current) {
        console.error('카드 요소를 찾을 수 없습니다');
        return null;
      }
      
      console.log('카드 요소 찾음:', cardRef.current);
      
      // 캐릭터 이미지가 완전히 로드될 때까지 대기
      const characterImage = cardRef.current.querySelector('img');
      if (characterImage) {
        console.log('캐릭터 이미지 발견:', characterImage.src);
        console.log('이미지 로딩 상태:', characterImage.complete);
        
        // 이미지가 로드되지 않았다면 대기
        if (!characterImage.complete) {
          console.log('이미지 로딩 대기 중...');
          await new Promise((resolve) => {
            characterImage.onload = () => {
              console.log('이미지 로딩 완료!');
              resolve();
            };
            characterImage.onerror = () => {
              console.log('이미지 로딩 실패, 계속 진행');
              resolve();
            };
          });
        } else {
          console.log('이미지 이미 로드됨');
        }
        
        // 추가 대기 시간 (렌더링 완료 보장)
        console.log('렌더링 완료 대기 중...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log('캐릭터 이미지를 찾을 수 없음');
      }
      
      // html2canvas로 카드 캡처 (개선된 설정)
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 고해상도
        useCORS: true, // CORS 허용
        allowTaint: true, // 외부 이미지 허용
        logging: true, // 로그 활성화
        imageTimeout: 10000, // 이미지 로딩 타임아웃 10초
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
      
      console.log('캔버스 생성됨:', canvas.width, 'x', canvas.height);
      
      // 이미지로 변환
      const imageDataURL = canvas.toDataURL('image/png', 1.0);
      
      return imageDataURL;
      
    } catch (error) {
      console.error('카드 이미지 생성 실패:', error);
      throw error;
    }
  };

  // 미리보기 함수
  const handlePreview = async () => {
    try {
      const imageDataURL = await generateCardImage();
      if (imageDataURL) {
        setPreviewImageData(imageDataURL);
        setShowPreviewModal(true);
      }
    } catch (error) {
      console.error('미리보기 실패:', error);
      alert('미리보기 실패: ' + error.message);
    }
  };

  // 다운로드 함수 (새로 생성)
  const handleDownload = async () => {
    try {
      const imageDataURL = await generateCardImage();
      if (imageDataURL) {
        // 다운로드
        const link = document.createElement('a');
        link.download = `${insectData.곤충_이름}_캐릭터카드.png`;
        link.href = imageDataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('다운로드 완료!');
      }
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드 실패: ' + error.message);
    }
  };

  // 모달 내부 다운로드 함수 (이미 생성된 이미지 사용)
  const handleModalDownload = () => {
    if (previewImageData) {
      const link = document.createElement('a');
      link.download = `${insectData.곤충_이름}_캐릭터카드.png`;
      link.href = previewImageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('모달에서 다운로드 완료!');
    }
  };

  // 이미지 재생성 함수
  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      setShowPreviewModal(false); // 모달 닫기
      setGenerationStatus('generating'); // 생성 화면 표시
      setIsGenerating(true);
      
      console.log('이미지 재생성 시작...');
      
      // 백엔드에서 새로운 이미지 생성
      const response = await generateCharacterFromInsect(insectData);
      
      if (response.success) {
        // 생성된 이미지 URL 설정
        const imageUrl = `http://localhost:8000${response.data.image_url}`;
        setGeneratedImage(imageUrl);
        
        // 랜덤 희귀도 생성 (1~5개 별)
        const randomRarity = Math.floor(Math.random() * 5) + 1;
        setRarityStars(randomRarity);
        
        setGenerationStatus('success');
        console.log('이미지 재생성 완료!');
      } else {
        throw new Error('캐릭터 재생성에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('이미지 재생성 실패:', error);
      setGenerationStatus('error');
      alert('이미지 재생성 실패: ' + error.message);
    } finally {
      setIsRegenerating(false);
      setIsGenerating(false);
    }
  };

  // 놓아주기 함수
  const handleRelease = () => {
    setShowReleaseModal(true);
  };

  // 모달에서 홈으로 이동
  const goToHome = () => {
    navigate('/');
  };

  // 새친구 데려오기 (업로드 페이지로 이동)
  const goToUpload = () => {
    navigate('/upload');
  };


  return (
    <CharacterContainer>
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
      </FloatingBubbles>


      <MainContent>
        {/* 로딩 중일 때 */}
        {generationStatus === 'generating' && (
          <LoadingCard>
            <LoadingSpinner />
            <LoadingText>
              AI가 {insectData.곤충_이름} 캐릭터 카드를<br />
              만들고 있습니다...
            </LoadingText>
          </LoadingCard>
        )}

        {/* 에러 상태 */}
        {generationStatus === 'error' && (
          <LoadingCard>
            <ErrorContent>
              <ErrorIcon />
              <ErrorText>
                캐릭터 생성에 실패했습니다<br />
                다시 시도해주세요
              </ErrorText>
              <ActionButtons>
                <ReleaseButton onClick={handleRelease}>
                  <FaHeart />
                  돌아가기
                </ReleaseButton>
              </ActionButtons>
            </ErrorContent>
          </LoadingCard>
        )}

        {/* 성공 - 포켓몬 카드 스타일 */}
        {generationStatus === 'success' && (
          <PokemonCard ref={cardRef}>
            {/* 카드 상단 - 이름과 희귀도 */}
            <RarityBadge>
              {Array.from({ length: rarityStars }, (_, index) => (
                <Star key={index} />
              ))}
            </RarityBadge>
            
            <CardHeader>
              <CardName>{insectData.곤충_이름}</CardName>
              <TypeBadge>
                <FaLeaf />
                {insectData.곤충_종류 || '곤충'}
              </TypeBadge>
            </CardHeader>

            {/* 캐릭터 이미지 섹션 */}
            <CardImageSection>
              {generatedImage && (
                <CharacterImage
                  src={generatedImage}
                  alt={`${insectData.곤충_이름} 캐릭터`}
                />
              )}
            </CardImageSection>

            {/* 카드 하단 - 곤충 정보 */}
            <CardStats>
              {insectData.곤충_이름_영문 && (
                <StatRow color="#FF6B35">
                  <StatLabel>영어명</StatLabel>
                  <StatValue>{insectData.곤충_이름_영문}</StatValue>
                </StatRow>
              )}
              
              {insectData.서식지 && (
                <StatRow color="#4CAF50">
                  <StatLabel>서식지</StatLabel>
                  <StatValue>{insectData.서식지}</StatValue>
                </StatRow>
              )}
            </CardStats>
          </PokemonCard>
        )}

        {/* 새친구 데려오기 버튼 (카드 완성 후 표시) */}
        {generationStatus === 'success' && (
          <NewFriendUploadButton onClick={goToUpload}>
            <FaUpload />
            새친구 데려오기
          </NewFriendUploadButton>
        )}

        {/* 액션 버튼들 (카드 완성 후 표시) */}
        {generationStatus === 'success' && (
          <ActionButtons>
            <DownloadButton onClick={handlePreview}>
              <FaDownload />
              간직하기
            </DownloadButton>
            <ReleaseButton onClick={handleRelease}>
              <FaHeart />
              놓아주기
            </ReleaseButton>
          </ActionButtons>
        )}
      </MainContent>

      {/* 놓아주기 모달 */}
      {showReleaseModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalIcon>🌱</ModalIcon>
            <ModalTitle>{insectData.곤충_이름} 친구가</ModalTitle>
            <ModalMessage>
              자연으로 돌아갔어요!<br />
              건강하게 잘 살아줘 !
            </ModalMessage>
            <ModalButton onClick={goToHome}>
              홈으로 돌아가기
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 미리보기 모달 */}
      {showPreviewModal && (
        <PreviewModalOverlay onClick={() => setShowPreviewModal(false)}>
          <PreviewModalContent onClick={(e) => e.stopPropagation()}>
            <PreviewTitle>{insectData.곤충_이름} 캐릭터 카드</PreviewTitle>
            {previewImageData && (
              <PreviewImage
                src={previewImageData}
                alt={`${insectData.곤충_이름} 캐릭터 카드 미리보기`}
              />
            )}
            <PreviewButtons>
              <PreviewDownloadButton onClick={handleModalDownload}>
                <FaDownload />
                간직하기
              </PreviewDownloadButton>
              <PreviewCloseButton onClick={() => setShowPreviewModal(false)}>
                닫기
              </PreviewCloseButton>
              <PreviewRegenerateButton 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                title="새로 만들기"
              >
                {isRegenerating ? (
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <FaRedo />
                )}
              </PreviewRegenerateButton>
            </PreviewButtons>
          </PreviewModalContent>
        </PreviewModalOverlay>
      )}
    </CharacterContainer>
  );
}

export default CharacterGeneration;
