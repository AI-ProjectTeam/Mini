/**
 * 프로젝트 소개 페이지 컴포넌트
 * 
 * 주요 기능:
 * 1. 프로젝트 개요 설명
 * 2. 기술 스택 소개
 * 3. 팀 정보
 * 4. 사용 방법 안내
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaPython, 
  FaReact, 
  FaBrain, 
  FaGithub, 
  FaRocket,
  FaUsers,
  FaCog,
  FaLightbulb
} from 'react-icons/fa';

const AboutContainer = styled.div`
  padding: 40px 24px;
  max-width: 1000px;
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

const Section = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px 32px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SectionContent = styled.div`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  font-size: 16px;
`;

const TechStack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const TechCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const TechIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  
  &.python { color: #3776ab; }
  &.react { color: #61dafb; }
  &.ai { color: #ff6b6b; }
`;

const TechTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
`;

const TechDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 24px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureIcon = styled.div`
  font-size: 16px;
  color: #4CAF50;
  margin-top: 2px;
`;

const FeatureText = styled.span`
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const TeamInfo = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const TeamDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  line-height: 1.6;
`;

const ProjectStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const ActionSection = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  margin: 0 8px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
  }
`;

const GitHubButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  margin: 0 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

function About() {
  return (
    <AboutContainer>
      <Title>프로젝트 소개</Title>
      <Subtitle>AI 기반 곤충 분류 및 캐릭터 변환 서비스</Subtitle>

      {/* 프로젝트 개요 */}
      <Section>
        <SectionTitle>
          <FaLightbulb />
          프로젝트 개요
        </SectionTitle>
        <SectionContent>
          <p>
            이 프로젝트는 사용자가 업로드한 곤충 사진을 AI로 분석하여 종류를 분류하고, 
            그 특징을 바탕으로 귀여운 캐릭터를 생성하는 웹 서비스입니다.
          </p>
          <p style={{ marginTop: '16px' }}>
            4일간의 미니 프로젝트로 진행되며, 최신 AI 기술과 웹 개발 기술을 
            결합하여 사용자에게 재미있고 유용한 경험을 제공합니다.
          </p>
          
          <ProjectStats>
            <StatCard>
              <StatNumber>4</StatNumber>
              <StatLabel>개발 기간 (일)</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>10+</StatNumber>
              <StatLabel>곤충 종류</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>5</StatNumber>
              <StatLabel>캐릭터 스타일</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>2</StatNumber>
              <StatLabel>AI 모델</StatLabel>
            </StatCard>
          </ProjectStats>
        </SectionContent>
      </Section>

      {/* 기술 스택 */}
      <Section>
        <SectionTitle>
          <FaCog />
          기술 스택
        </SectionTitle>
        <SectionContent>
          <p>현대적이고 확장 가능한 기술 스택을 사용하여 개발되었습니다.</p>
          
          <TechStack>
            <TechCard>
              <TechIcon className="python">
                <FaPython />
              </TechIcon>
              <TechTitle>백엔드</TechTitle>
              <TechDescription>
                Python, FastAPI, PyTorch를 사용한 
                고성능 AI 서비스 백엔드
              </TechDescription>
            </TechCard>

            <TechCard>
              <TechIcon className="react">
                <FaReact />
              </TechIcon>
              <TechTitle>프론트엔드</TechTitle>
              <TechDescription>
                React, Styled Components를 사용한 
                모던하고 반응형 사용자 인터페이스
              </TechDescription>
            </TechCard>

            <TechCard>
              <TechIcon className="ai">
                <FaBrain />
              </TechIcon>
              <TechTitle>AI 모델</TechTitle>
              <TechDescription>
                CNN 기반 분류 모델과 생성형 AI를 
                활용한 캐릭터 생성
              </TechDescription>
            </TechCard>
          </TechStack>
        </SectionContent>
      </Section>

      {/* 주요 기능 */}
      <Section>
        <SectionTitle>
          <FaRocket />
          주요 기능
        </SectionTitle>
        <SectionContent>
          <p>사용자 친화적이고 강력한 기능들을 제공합니다.</p>
          
          <FeatureList>
            <FeatureItem>
              <FeatureIcon>✨</FeatureIcon>
              <FeatureText>
                <strong>드래그 앤 드롭 업로드:</strong> 
                간편하게 이미지를 업로드할 수 있습니다.
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureText>
                <strong>정확한 곤충 분류:</strong> 
                딥러닝 모델을 통한 높은 정확도의 곤충 종류 분류
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>🎨</FeatureIcon>
              <FeatureText>
                <strong>캐릭터 생성:</strong> 
                곤충의 특징을 반영한 귀여운 캐릭터 자동 생성
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureText>
                <strong>상세한 결과:</strong> 
                분류 확률, 처리 시간 등 상세한 분석 결과 제공
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>💾</FeatureIcon>
              <FeatureText>
                <strong>결과 다운로드:</strong> 
                생성된 캐릭터 이미지를 다운로드할 수 있습니다.
              </FeatureText>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureText>
                <strong>반응형 디자인:</strong> 
                모바일과 데스크톱 모든 환경에서 최적화된 경험
              </FeatureText>
            </FeatureItem>
          </FeatureList>
        </SectionContent>
      </Section>

      {/* 팀 정보 */}
      <Section>
        <SectionTitle>
          <FaUsers />
          팀 프로젝트
        </SectionTitle>
        <SectionContent>
          <TeamInfo>
            <TeamDescription>
              이 프로젝트는 AI와 웹 개발에 관심있는 팀원들이 모여 
              4일간 집중적으로 개발한 미니 프로젝트입니다.
            </TeamDescription>
            <TeamDescription>
              각자의 전문 분야를 살려 백엔드 AI 개발, 프론트엔드 UI/UX 개발, 
              그리고 통합 테스트를 분담하여 진행했습니다.
            </TeamDescription>
          </TeamInfo>
        </SectionContent>
      </Section>

      {/* 액션 버튼 */}
      <ActionSection>
        <ActionButton to="/upload">
          <FaRocket />
          지금 체험해보기
        </ActionButton>
        
        <GitHubButton 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaGithub />
          GitHub에서 보기
        </GitHubButton>
      </ActionSection>
    </AboutContainer>
  );
}

export default About;
