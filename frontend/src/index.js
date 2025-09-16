/**
 * React 앱의 진입점
 * 전체 애플리케이션을 DOM에 렌더링하는 역할
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React 18의 새로운 createRoot API 사용
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
