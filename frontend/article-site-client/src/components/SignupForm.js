import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
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
    <div className="max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">회원가입</h2>
        <Button 
          onClick={() => navigate('/')}
          variant="secondary"
        >
          목록으로
        </Button>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            사용자 이름:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이메일:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="passwordCheck"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호 확인:
          </label>
          <input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            value={formData.passwordCheck}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;