/**
 * 홈 페이지 컴포넌트
 * Figma 디자인에 맞춘 심플한 메인 화면
 * 
 * 주요 기능:
 * 1. 환영 메시지
 * 2. LittlePet 로고 및 캐릭터 이미지 (추후 교체 예정)
 * 3. 곤충 친구 대답하기 버튼 (업로드 페이지로 이동)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import miniCharAnimation from '../assets/mini-char.json';

const HomeContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

const WelcomeText = styled.h1`
  font-size: 32px;
  font-weight: 500;
  color: #8B4513;
  margin: 0 0 25px 0;
  text-align: center;
  font-family: 'Jua', sans-serif !important;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    font-size: 26px;
    margin: 0 0 18px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
    margin: 0 0 12px 0;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin: 0 0 20px 0;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    margin: 0 0 15px 0;
  }
  
  @media (max-width: 480px) {
    margin: 0 0 10px 0;
  }
`;

const LogoImage = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoTitle = styled.h2`
  font-size: 48px;
  font-weight: 400;
  color: #FF6B35;
  margin: 0 0 20px 0;
  font-family: 'Lilita One', cursive !important;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 36px;
    margin: 0 0 15px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
    margin: 0 0 12px 0;
  }
`;

const CharacterAnimation = styled.div`
  width: 400px;
  height: 300px;
  margin: 0 0 15px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  padding: 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(139, 69, 19, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }
  
  @media (max-width: 768px) {
    width: 320px;
    height: 240px;
    padding: 20px;
    margin: 0 0 12px 0;
  }
  
  @media (max-width: 480px) {
    width: 280px;
    height: 210px;
    padding: 18px;
    margin: 0 0 10px 0;
  }
`;

const PlaceholderText = styled.p`
  color: #8B4513;
  font-size: 12px;
  margin: 8px 0 0 0;
  opacity: 0.7;
  font-family: 'Noto Sans KR', sans-serif !important;
  
  @media (max-width: 768px) {
    font-size: 11px;
    margin: 6px 0 0 0;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    margin: 5px 0 0 0;
  }
`;

const StartButton = styled(Link)`
  display: inline-block;
  padding: 20px 50px;
  background: linear-gradient(45deg, #CD853F, #D2691E);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 20px;
  font-weight: 400;
  font-family: 'Jua', sans-serif !important;
  box-shadow: 0 10px 30px rgba(205, 133, 63, 0.4);
  transition: all 0.3s ease;
  margin: 0;
  position: relative;
  z-index: 10;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(205, 133, 63, 0.6);
    background: linear-gradient(45deg, #D2691E, #CD853F);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 16px 38px;
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 32px;
    font-size: 16px;
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
`;

function Home() {
  return (
    <HomeContainer>
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
      
      <WelcomeText>곤충 친구들과 함께해요!</WelcomeText>
      
      <LogoSection>
        <LogoImage>
          <LogoTitle>LittlePet</LogoTitle>
          <CharacterAnimation>
            <Lottie 
              animationData={miniCharAnimation}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </CharacterAnimation>
          <PlaceholderText>귀여운 곤충 친구들이 기다리고 있어요!</PlaceholderText>
        </LogoImage>
      </LogoSection>
      
      <StartButton to="/upload">
        곤충 친구 만들기
      </StartButton>
    </HomeContainer>
  );
}

export default Home;
