import { useState } from 'react';

export const useFormError = () => {
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleError = (error) => {
    if (error.response?.data) {
      const errorResponse = error.response.data;
      
      if (errorResponse.errors) {
        setErrors(errorResponse.errors);
        setGeneralError('');
      } else {
        setGeneralError(errorResponse.message || '요청 처리 중 오류가 발생했습니다.');
        setErrors({});
      }
    } else {
      setGeneralError(error.message || '알 수 없는 오류가 발생했습니다.');
      setErrors({});
    }
  };

  const clearErrors = () => {
    setErrors({});
    setGeneralError('');
  };

  return { errors, generalError, handleError, clearErrors };
}; 