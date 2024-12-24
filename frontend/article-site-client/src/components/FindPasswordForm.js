import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useFormError } from '../hooks/useFormError';

const FindPasswordForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const { errors, generalError, handleError, clearErrors } = useFormError();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!formData.username?.trim()) {
      errors.username = '닉네임은 필수항목입니다';
    }
    if (!formData.email?.trim()) {
      errors.email = '이메일은 필수항목입니다';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      handleError({ response: { data: { errors: validationErrors } } });
      return;
    }

    try {
      const response = await api.post('/api/v1/user/find-password', formData);
      console.log('Password reset response:', response.data);
      
      const newPassword = response.data.password;
      alert(`임시 비밀번호가 발급되었습니다: ${newPassword}\n\n이 비밀번호로 로그인 후 반드시 변경해주세요.`);
      navigate('/login');
    } catch (error) {
      handleError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">비밀번호 찾기</h2>
      <Button onClick={() => navigate('/')} className="mb-6">목록으로</Button>
      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            닉네임:
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
          {errors.username && <ErrorMessage message={errors.username} />}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>

        <Button type="submit" className="w-full">비밀번호 찾기</Button>
      </form>
    </div>
  );
};

export default FindPasswordForm; 