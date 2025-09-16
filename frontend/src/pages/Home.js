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

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
`;

const WelcomeText = styled.h1`
  font-size: 32px;
  font-weight: 500;
  color: #8B4513;
  margin-bottom: 60px;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 40px;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const LogoImage = styled.div`
  width: 400px;
  height: 300px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(139, 69, 19, 0.2);
  
  @media (max-width: 768px) {
    width: 300px;
    height: 225px;
  }
  
  @media (max-width: 480px) {
    width: 280px;
    height: 210px;
  }
`;

const LogoTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  color: #FF6B35;
  margin-bottom: 20px;
  font-family: 'Comic Sans MS', cursive, 'Noto Sans KR', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const CharacterPlaceholder = styled.div`
  width: 200px;
  height: 150px;
  background: linear-gradient(45deg, #FFE4B5, #DEB887);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    width: 160px;
    height: 120px;
    font-size: 48px;
  }
  
  @media (max-width: 480px) {
    width: 140px;
    height: 105px;
    font-size: 42px;
  }
`;

const PlaceholderText = styled.p`
  color: #8B4513;
  font-size: 14px;
  margin-top: 10px;
  opacity: 0.7;
`;

const StartButton = styled(Link)`
  display: inline-block;
  padding: 18px 48px;
  background: linear-gradient(45deg, #CD853F, #D2691E);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  box-shadow: 0 8px 25px rgba(205, 133, 63, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(205, 133, 63, 0.6);
    background: linear-gradient(45deg, #D2691E, #CD853F);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 16px 40px;
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
      <WelcomeText>안녕하세요</WelcomeText>
      
      <LogoSection>
        <LogoImage>
          <LogoTitle>LittlePet</LogoTitle>
          <CharacterPlaceholder>
            🐛🦋🐞
          </CharacterPlaceholder>
          <PlaceholderText>* 곧 귀여운 캐릭터 이미지로 교체될 예정입니다</PlaceholderText>
        </LogoImage>
      </LogoSection>
      
      <StartButton to="/upload">
        곤충 친구 대답하기
      </StartButton>
    </HomeContainer>
  );
}

export default Home;
