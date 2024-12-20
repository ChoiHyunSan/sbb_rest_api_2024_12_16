import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordCheck: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await api.post('/api/v1/user', {
        username: formData.username,
        email: formData.email,
        password1: formData.password,
        password2: formData.passwordCheck
      });
      
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={commonStyles.container}>
      <h2>회원가입</h2>
      <Button onClick={() => navigate('/')}>목록으로</Button>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={commonStyles.form}>
        <div style={commonStyles.formGroup}>
          <label htmlFor="username">사용자 이름:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
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
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="passwordCheck">비밀번호 확인:</label>
          <input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            value={formData.passwordCheck}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
        </div>

        <Button type="submit">회원가입</Button>
      </form>
    </div>
  );
};

export default SignupForm;