/**
 * 홈 페이지 컴포넌트
 * 서비스 소개 및 시작 안내를 제공
 * 
 * 주요 기능:
 * 1. 서비스 소개
 * 2. 주요 기능 설명
 * 3. 시작하기 버튼
 * 4. 프로젝트 정보
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBug, FaUpload, FaMagic, FaRocket, FaPalette } from 'react-icons/fa';

const HomeContainer = styled.div`
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 80px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 24px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const HeroIcon = styled(FaBug)`
  font-size: 80px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const StartButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    background: #f8f9ff;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 48px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  color: white;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const ProcessSection = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 48px 32px;
  margin-bottom: 80px;
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-top: 32px;
`;

const ProcessStep = styled.div`
  text-align: center;
  position: relative;
  
  &:not(:last-child)::after {
    content: '→';
    position: absolute;
    top: 50%;
    right: -16px;
    transform: translateY(-50%);
    font-size: 24px;
    color: rgba(255, 255, 255, 0.6);
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const StepTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
`;

const StepDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

function Home() {
  return (
    <HomeContainer>
      {/* 히어로 섹션 */}
      <HeroSection>
        <HeroIcon />
        <Title>곤충 캐릭터 변환기</Title>
        <Subtitle>
          AI 기술로 곤충 사진을 분석하고 
          <br />
          귀여운 캐릭터로 변환해드립니다! 🎨
        </Subtitle>
        <StartButton to="/upload">
          <FaRocket />
          지금 시작하기
        </StartButton>
      </HeroSection>

      {/* 주요 기능 섹션 */}
      <FeaturesSection>
        <SectionTitle>주요 기능</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaUpload />
            </FeatureIcon>
            <FeatureTitle>간편한 업로드</FeatureTitle>
            <FeatureDescription>
              드래그 앤 드롭으로 쉽게 곤충 사진을 업로드하고
              즉시 처리를 시작할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaBug />
            </FeatureIcon>
            <FeatureTitle>정확한 분류</FeatureTitle>
            <FeatureDescription>
              PyTorch 기반 딥러닝 모델로 곤충의 종류를 
              높은 정확도로 분류합니다.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaPalette />
            </FeatureIcon>
            <FeatureTitle>캐릭터 변환</FeatureTitle>
            <FeatureDescription>
              생성형 AI가 곤충의 특징을 분석하여
              귀엽고 독특한 캐릭터로 변환합니다.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* 사용 방법 섹션 */}
      <ProcessSection>
        <SectionTitle>사용 방법</SectionTitle>
        <ProcessSteps>
          <ProcessStep>
            <StepNumber>1</StepNumber>
            <StepTitle>이미지 업로드</StepTitle>
            <StepDescription>
              곤충 사진을 업로드하거나
              드래그 앤 드롭으로 추가하세요
            </StepDescription>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>2</StepNumber>
            <StepTitle>AI 분석</StepTitle>
            <StepDescription>
              AI가 곤충의 종류를 분석하고
              특징을 추출합니다
            </StepDescription>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>3</StepNumber>
            <StepTitle>캐릭터 생성</StepTitle>
            <StepDescription>
              분석 결과를 바탕으로
              귀여운 캐릭터를 생성합니다
            </StepDescription>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>4</StepNumber>
            <StepTitle>결과 확인</StepTitle>
            <StepDescription>
              분류 결과와 생성된 캐릭터를
              확인하고 다운로드하세요
            </StepDescription>
          </ProcessStep>
        </ProcessSteps>
      </ProcessSection>
    </HomeContainer>
  );
}

export default Home;
