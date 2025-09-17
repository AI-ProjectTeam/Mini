/**
 * Gemini API 키 설정 모달 컴포넌트
 * 사용자가 Gemini API 키를 입력하고 설정할 수 있는 모달
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { FaKey, FaTimes, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import { setGeminiApiKey } from '../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #003300;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #003300;
  margin-bottom: 8px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 50px 16px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #333;
    background: #f0f0f0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.primary {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
    }
  }
  
  &.secondary {
    background: #f5f5f5;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: #e74c3c;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessText = styled.p`
  font-size: 14px;
  color: #27ae60;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function ApiKeyModal({ isOpen, onClose, onSuccess }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await setGeminiApiKey(apiKey.trim());
      
      if (result.success) {
        setSuccess('API 키가 성공적으로 설정되었습니다!');
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 1500);
      } else {
        setError('API 키 설정에 실패했습니다.');
      }
    } catch (err) {
      setError(err.message || 'API 키 설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApiKey('');
    setError('');
    setSuccess('');
    setShowKey(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FaKey />
            Gemini API 키 설정
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <InfoText>
          <strong>Gemini API 키가 필요합니다!</strong><br/>
          곤충 분석 기능을 사용하려면 Google Gemini API 키가 필요합니다.<br/>
          <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50', textDecoration: 'underline' }}>
            여기서 API 키를 발급받으세요
          </a>
        </InfoText>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="apiKey">API 키</Label>
            <InputContainer>
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSyC..."
                disabled={loading}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowKey(!showKey)}
                disabled={loading}
              >
                {showKey ? <FaEyeSlash /> : <FaEye />}
              </ToggleButton>
            </InputContainer>
            
            {error && (
              <ErrorText>
                <FaTimes />
                {error}
              </ErrorText>
            )}
            
            {success && (
              <SuccessText>
                <FaCheck />
                {success}
              </SuccessText>
            )}
          </FormGroup>

          <ButtonContainer>
            <Button
              type="button"
              className="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="primary"
              disabled={loading || !apiKey.trim()}
            >
              {loading ? '설정 중...' : 'API 키 설정'}
            </Button>
          </ButtonContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ApiKeyModal;
