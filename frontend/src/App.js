/**
 * 메인 App 컴포넌트
 * 라우팅과 전체 레이아웃을 관리
 * 
 * 주요 기능:
 * 1. React Router를 사용한 페이지 라우팅
 * 2. 네비게이션 바 제공
 * 3. 전역 상태 관리 (필요시 Context API 사용)
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// 컴포넌트 임포트
import Header from './components/Header';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Result from './pages/Result';
import About from './pages/About';

// API 서비스
import { checkServerStatus } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px; /* 헤더 높이만큼 여백 */
  min-height: calc(100vh - 80px);
`;

const ServerStatus = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1000;
  
  ${props => props.connected ? `
    background: #4CAF50;
    color: white;
  ` : `
    background: #f44336;
    color: white;
  `}
`;

function App() {
  // 서버 연결 상태 관리
  const [serverConnected, setServerConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * 컴포넌트 마운트 시 서버 상태 확인
   */
  useEffect(() => {
    checkServerConnection();
    
    // 30초마다 서버 상태 확인
    const interval = setInterval(checkServerConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * 서버 연결 상태를 확인하는 함수
   */
  const checkServerConnection = async () => {
    try {
      const status = await checkServerStatus();
      setServerConnected(status.success);
    } catch (error) {
      setServerConnected(false);
      console.error('서버 연결 확인 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppContainer>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
          fontSize: '18px'
        }}>
          <div className="loading" style={{ marginRight: '12px' }}></div>
          서버 연결 확인 중...
        </div>
      </AppContainer>
    );
  }

  return (
    <Router>
      <AppContainer>
        {/* 서버 상태 표시 */}
        <ServerStatus connected={serverConnected}>
          {serverConnected ? '🟢 서버 연결됨' : '🔴 서버 연결 안됨'}
        </ServerStatus>

        {/* 헤더 네비게이션 */}
        <Header />

        {/* 메인 콘텐츠 영역 */}
        <MainContent>
          <Routes>
            {/* 홈 페이지 - 서비스 소개 */}
            <Route path="/" element={<Home />} />
            
            {/* 업로드 페이지 - 이미지 업로드 및 처리 */}
            <Route path="/upload" element={<Upload serverConnected={serverConnected} />} />
            
            {/* 결과 페이지 - 분류 결과 및 캐릭터 표시 */}
            <Route path="/result" element={<Result />} />
            
            {/* 소개 페이지 - 프로젝트 정보 */}
            <Route path="/about" element={<About />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
