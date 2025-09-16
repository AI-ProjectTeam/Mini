/**
 * API 통신 서비스
 * 백엔드 FastAPI 서버와의 모든 HTTP 통신을 담당
 * 
 * 주요 기능:
 * 1. 서버 상태 확인
 * 2. 이미지 업로드
 * 3. 곤충 분류 요청
 * 4. 캐릭터 생성 요청
 * 5. 전체 파이프라인 처리 요청
 */

import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 로깅
api.interceptors.request.use(
  (config) => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    console.log(`API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * 서버 상태 확인
 * @returns {Promise<Object>} 서버 상태 정보
 */
export const checkServerStatus = async () => {
  try {
    const response = await api.get('/');
    return {
      success: true,
      data: response.data,
      message: '서버가 정상적으로 작동중입니다.'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: '서버에 연결할 수 없습니다.'
    };
  }
};

/**
 * 서버 헬스 체크
 * @returns {Promise<Object>} 서버 및 모델 상태
 */
export const checkHealthStatus = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    throw new Error(`헬스 체크 실패: ${error.message}`);
  }
};

/**
 * 단순 이미지 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<Object>} 업로드 결과
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // 업로드 진행률 추적 (필요시 사용)
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`업로드 진행률: ${percentCompleted}%`);
      },
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    throw new Error(`이미지 업로드 실패: ${error.response?.data?.detail || error.message}`);
  }
};

/**
 * 곤충 분류 요청
 * @param {File} file - 분류할 곤충 이미지 파일
 * @returns {Promise<Object>} 분류 결과
 */
export const classifyInsect = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/classify-insect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    throw new Error(`곤충 분류 실패: ${error.response?.data?.detail || error.message}`);
  }
};

/**
 * 캐릭터 생성 요청
 * @param {File} file - 캐릭터로 변환할 곤충 이미지 파일
 * @returns {Promise<Object>} 생성 결과
 */
export const generateCharacter = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/generate-character', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    throw new Error(`캐릭터 생성 실패: ${error.response?.data?.detail || error.message}`);
  }
};

/**
 * 전체 파이프라인 처리 (분류 + 캐릭터 생성)
 * @param {File} file - 처리할 곤충 이미지 파일
 * @returns {Promise<Object>} 전체 처리 결과
 */
export const processFullPipeline = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/process-full', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 전체 처리는 더 긴 타임아웃
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    throw new Error(`전체 처리 실패: ${error.response?.data?.detail || error.message}`);
  }
};

/**
 * 파일 유효성 검사
 * @param {File} file - 검사할 파일
 * @returns {Object} 유효성 검사 결과
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { valid: false, message: '파일을 선택해주세요.' };
  }

  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: '지원되지 않는 파일 형식입니다. (JPG, PNG, BMP, GIF만 가능)' 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: '파일 크기가 너무 큽니다. (최대 10MB)' 
    };
  }

  return { valid: true, message: '유효한 파일입니다.' };
};

/**
 * 이미지 미리보기 URL 생성
 * @param {File} file - 이미지 파일
 * @returns {string} 미리보기 URL
 */
export const createImagePreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * 미리보기 URL 해제
 * @param {string} url - 해제할 URL
 */
export const revokeImagePreviewUrl = (url) => {
  URL.revokeObjectURL(url);
};
