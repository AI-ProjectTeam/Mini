/**
 * 헤더 네비게이션 컴포넌트
 * 
 * 주요 기능:
 * 1. 사이트 로고 및 제목
 * 2. 네비게이션 메뉴
 * 3. 반응형 모바일 메뉴
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBug, FaBars, FaTimes } from 'react-icons/fa';
import Lottie from 'lottie-react';
import beeAnimation from '../assets/mini-main.json';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #8B4513;
  font-size: 24px;
  font-weight: 400;
  margin-right: auto;
  font-family: 'Lilita One', cursive !important;
  letter-spacing: 0.5px;
  
  &:hover {
    color: #CD853F;
  }
`;

const LogoIcon = styled(FaBug)`
  margin-right: 12px;
  font-size: 28px;
`;

const BeeContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  animation: flyBee 17s infinite ease-in-out;
  z-index: 5;
  pointer-events: none; /* 클릭 방지 */
  
  @keyframes flyBee {
    0% {
      left: -70px;
      top: 15px;
      transform: scale(0.7) rotateY(0deg);
    }
    10% {
      left: 15%;
      top: 25px;
      transform: scale(0.9) rotateY(0deg);
    }
    25% {
      left: 30%;
      top: 10px;
      transform: scale(1) rotateY(-10deg);
    }
    40% {
      left: 50%;
      top: 30px;
      transform: scale(0.8) rotateY(5deg);
    }
    60% {
      left: 70%;
      top: 8px;
      transform: scale(1.1) rotateY(-5deg);
    }
    75% {
      left: 85%;
      top: 22px;
      transform: scale(0.9) rotateY(0deg);
    }
    90% {
      left: 95%;
      top: 15px;
      transform: scale(0.7) rotateY(0deg);
    }
    100% {
      left: calc(100% + 70px);
      top: 20px;
      transform: scale(0.7) rotateY(0deg);
    }
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    animation: flyBeeMobile 14s infinite ease-in-out;
    
    @keyframes flyBeeMobile {
      0% {
        left: -50px;
        top: 12px;
        transform: scale(0.5) rotateY(0deg);
      }
      25% {
        left: 25%;
        top: 8px;
        transform: scale(0.7) rotateY(-10deg);
      }
      50% {
        left: 50%;
        top: 18px;
        transform: scale(0.6) rotateY(5deg);
      }
      75% {
        left: 75%;
        top: 5px;
        transform: scale(0.8) rotateY(-5deg);
      }
      100% {
        left: calc(100% + 50px);
        top: 12px;
        transform: scale(0.5) rotateY(0deg);
      }
    }
  }
`;

const BeeAnimation = styled(Lottie)`
  width: 100%;
  height: 100%;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 24px;
    gap: 24px;
    transform: translateY(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #8B4513;
  font-weight: 400;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  font-family: 'Jua', sans-serif !important;
  
  ${props => props.active && `
    color: #CD853F;
    background: rgba(205, 133, 63, 0.1);
  `}
  
  &:hover {
    color: #CD853F;
    background: rgba(205, 133, 63, 0.1);
    transform: translateY(-1px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 0;
    height: 2px;
    background: #CD853F;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  ${props => props.active && `
    &::after {
      width: 80%;
    }
  `}
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #8B4513;
  cursor: pointer;
  padding: 8px;
  font-family: 'Noto Sans KR', sans-serif !important;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  /**
   * 모바일 메뉴 토글
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  /**
   * 네비게이션 링크 클릭 시 모바일 메뉴 닫기
   */
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  /**
   * 현재 경로가 활성 상태인지 확인
   */
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <HeaderContainer>
      {/* 꿀벌 애니메이션 */}
      <BeeContainer>
        <BeeAnimation 
          animationData={beeAnimation}
          loop={true}
          autoplay={true}
        />
      </BeeContainer>

      {/* 로고 */}
      <Logo to="/" onClick={handleNavLinkClick}>
        <LogoIcon />
        LittlePet
      </Logo>

      {/* 데스크톱 네비게이션 */}
      <Nav isOpen={mobileMenuOpen}>
        <NavLink 
          to="/about" 
          active={isActiveRoute('/about')}
          onClick={handleNavLinkClick}
        >
          프로젝트 소개
        </NavLink>
      </Nav>

      {/* 모바일 메뉴 버튼 */}
      <MobileMenuButton onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>
    </HeaderContainer>
  );
}

export default Header;
