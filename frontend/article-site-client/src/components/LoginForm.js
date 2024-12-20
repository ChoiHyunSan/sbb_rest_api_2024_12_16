// components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

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

    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={commonStyles.container}>
      <h2>로그인</h2>
      <Button onClick={() => navigate('/')}>목록으로</Button>
      <ErrorMessage message={error} />

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

        <Button type="submit">로그인</Button>
      </form>
    </div>
  );
};

export default LoginForm;