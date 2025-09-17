/**
 * 프로젝트 소개 페이지 컴포넌트
 * 홈 페이지 UX/UI 스타일 맞춰 디자인
 * 
 * 주요 기능:
 * 1. 프로젝트 개요 설명
 * 2. 기술 스택 소개
 * 3. 주요 기능 안내
 * 4. 사용 방법 가이드
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import miniMainAnimation from '../assets/mini-main.json';

const AboutContainer = styled.div`
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

const ProjectTitle = styled.h1`
  font-size: 42px;
  font-weight: 400;
  color: #FF6B35;
  margin: 0 0 25px 0;
  text-align: center;
  font-family: 'Lilita One', cursive !important;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 34px;
    margin: 0 0 18px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
    margin: 0 0 12px 0;
  }
`;

const ProjectSubtitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: #8B4513;
  margin: 0 0 30px 0;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif !important;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin: 0 0 20px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin: 0 0 15px 0;
  }
`;

const ContentSection = styled.div`
  text-align: center;
  margin: 0 0 30px 0;
  
  @media (max-width: 768px) {
    margin: 0 0 20px 0;
  }
  
  @media (max-width: 480px) {
    margin: 0 0 15px 0;
  }
`;

const MainAnimation = styled.div`
  width: 300px;
  height: 225px;
  margin: 0 0 20px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  padding: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(139, 69, 19, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }
  
  @media (max-width: 768px) {
    width: 260px;
    height: 195px;
    padding: 18px;
    margin: 0 0 15px 0;
  }
  
  @media (max-width: 480px) {
    width: 220px;
    height: 165px;
    padding: 15px;
    margin: 0 0 12px 0;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 0 0 30px 0;
  max-width: 600px;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin: 0 0 20px 0;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin: 0 0 15px 0;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(139, 69, 19, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 14px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 32px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 6px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #8B4513;
  margin: 0 0 8px 0;
  font-family: 'Noto Sans KR', sans-serif !important;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0 0 6px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin: 0 0 5px 0;
  }
`;

const FeatureDescription = styled.p`
  font-size: 12px;
  color: #8B4513;
  opacity: 0.8;
  margin: 0;
  font-family: 'Noto Sans KR', sans-serif !important;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 0;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 18px 40px;
  background: linear-gradient(45deg, #CD853F, #D2691E);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 18px;
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
    padding: 16px 32px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    font-size: 14px;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 18px 40px;
  background: rgba(255, 255, 255, 0.9);
  color: #8B4513;
  text-decoration: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Jua', sans-serif !important;
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.2);
  border: 2px solid rgba(139, 69, 19, 0.3);
  transition: all 0.3s ease;
  margin: 0;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(139, 69, 19, 0.3);
    background: rgba(255, 255, 255, 1);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    font-size: 14px;
  }
`;

function About() {
  return (
    <AboutContainer>
      <ProjectTitle>LittlePet</ProjectTitle>
      <ProjectSubtitle>AI 기반 곤충 분류 및 캐릭터 변환 서비스</ProjectSubtitle>
      
      <ContentSection>
        <MainAnimation>
          <Lottie 
            animationData={miniMainAnimation}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </MainAnimation>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>AI 곤충 분류</FeatureTitle>
            <FeatureDescription>
              딥러닝으로 곤충 종류를 정확하게 분석해요
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>캐릭터 생성</FeatureTitle>
            <FeatureDescription>
              곤충 특징을 반영한 귀여운 캐릭터를 만들어요
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>간편한 업로드</FeatureTitle>
            <FeatureDescription>
              드래그 앤 드롭으로 쉽게 사진을 올려보세요
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💾</FeatureIcon>
            <FeatureTitle>결과 다운로드</FeatureTitle>
            <FeatureDescription>
              생성된 캐릭터 이미지를 저장할 수 있어요
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </ContentSection>
      
      <ActionButtons>
        <PrimaryButton to="/">
          곤충 친구 만나러가기
        </PrimaryButton>
        <SecondaryButton to="/result">
          샘플 결과 보기
        </SecondaryButton>
      </ActionButtons>
    </AboutContainer>
  );
}

export default About;
