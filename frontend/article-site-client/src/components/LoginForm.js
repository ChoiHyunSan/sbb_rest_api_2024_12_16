// components/LoginForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useFormError } from '../hooks/useFormError';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { errors, generalError, handleError, clearErrors } = useFormError();
  const navigate = useNavigate();
  const { login, handleOAuthLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // URL에서 인증 코드 확인
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    
    if (code) {
      // 카카오 로그인 인증 코드가 있으면 처리
      handleOAuthLogin(code)
        .then(() => {
          navigate('/list');  // /에서 /list로 변경
        })
        .catch((error) => {
          handleError(error);  // 에러 처리
        });
    }
  }, [location, handleOAuthLogin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    try {
      await login(formData.username, formData.password);
      navigate('/list');
    } catch (error) {
      handleError(error);
    }
  };

  const handleKakaoLogin = () => {
    // 리다이렉트 URI를 제거하고 백엔드에서 설정된 URI 사용
    window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div style={commonStyles.container}>
      <h2>로그인</h2>
      <Button onClick={() => navigate('/')}>목록으로</Button>
      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} style={commonStyles.form}>
        <div style={commonStyles.formGroup}>
          <label htmlFor="username">아이디:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
          {errors.username && <ErrorMessage message={errors.username} />}
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>

        <Button type="submit">로그인</Button>
      </form>

      <div style={styles.socialLogin}>
        <h3>소셜 로그인</h3>
        <Button 
          onClick={handleKakaoLogin}
          style={styles.kakaoButton}
        >
          카카오로 로그인
        </Button>
      </div>
    </div>
  );
};

const styles = {
  socialLogin: {
    marginTop: '2rem',
    textAlign: 'center'
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    color: '#000000',
    border: 'none',
    width: '100%',
    maxWidth: '300px',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px'
  }
};

export default LoginForm;