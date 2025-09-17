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
  font-family: 'Noto Sans KR', sans-serif !important;
  
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

function Home() {
  return (
    <HomeContainer>
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
