import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useFormError } from '../hooks/useFormError';

const UpdatePasswordForm = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    checkPassword: ''
  });
  const { errors, generalError, handleError, clearErrors } = useFormError();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!formData.oldPassword) {
      errors.oldPassword = '현재 비밀번호를 입력해주세요';
    }
    if (!formData.newPassword) {
      errors.newPassword = '새 비밀번호를 입력해주세요';
    }
    if (!formData.checkPassword) {
      errors.checkPassword = '새 비밀번호 확인을 입력해주세요';
    } else if (formData.newPassword !== formData.checkPassword) {
      errors.checkPassword = '새 비밀번호가 일치하지 않습니다';
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
      await api.patch('/api/v1/user/update-password', formData);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/profile');
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
      <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 변경</h2>
      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label 
            htmlFor="oldPassword" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            현재 비밀번호:
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.oldPassword && <ErrorMessage message={errors.oldPassword} />}
        </div>

        <div>
          <label 
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            새 비밀번호:
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.newPassword && <ErrorMessage message={errors.newPassword} />}
        </div>

        <div>
          <label 
            htmlFor="checkPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            새 비밀번호 확인:
          </label>
          <input
            type="password"
            id="checkPassword"
            name="checkPassword"
            value={formData.checkPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.checkPassword && <ErrorMessage message={errors.checkPassword} />}
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <Button type="submit" variant="primary">
            비밀번호 변경
          </Button>
          <Button 
            onClick={() => navigate('/profile')} 
            type="button"
            variant="secondary"
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordForm; 