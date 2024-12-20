import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';

const AnswerInput = ({ id, onAnswerSubmit }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('답변을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      await api.post(`/api/v1/answers/${id}`, { content });
      setContent('');
      onAnswerSubmit();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={commonStyles.container}>
      <h3>답변 작성</h3>
      <ErrorMessage message={error} />
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답변을 입력해주세요"
          style={commonStyles.textarea}
          required
        />
        <Button type="submit">
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