import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AnswerInput = ({ id, onAnswerSubmit }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('답변을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const response = await api.post(`/api/v1/answers/${id}`, { content });
      setContent('');
      onAnswerSubmit();

      navigate(`/answer/${response.data.id}/comments`, { 
        state: { answer: response.data } 
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-xl font-semibold mb-4">답변 작성</h3>
      <ErrorMessage message={error} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답변을 입력해주세요"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
          required
        />
        <Button type="submit" className="w-full">
          답변 등록
        </Button>
      </form>
    </div>
  );
};

AnswerInput.propTypes = {
  id: PropTypes.string.isRequired,
  onAnswerSubmit: PropTypes.func.isRequired
};

export default AnswerInput;