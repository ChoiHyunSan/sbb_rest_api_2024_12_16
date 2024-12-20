import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 수정
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Bean Validation 에러 처리
    if (error.response?.data) {
      const errorResponse = error.response.data;
      
      // validation 에러인 경우 (MethodArgumentNotValidException)
      if (errorResponse.errors && Object.keys(errorResponse.errors).length > 0) {
        // 첫 번째 validation 에러 메시지를 사용
        const firstError = Object.values(errorResponse.errors)[0];
        error.message = firstError;
      } else {
        // 일반 에러 메시지 사용
        error.message = errorResponse.message || '요청 처리 중 오류가 발생했습니다.';
      }
    }
    
    return Promise.reject(error);
  }
);

export { api }; 