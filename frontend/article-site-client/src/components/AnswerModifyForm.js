import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';

const AnswerModifyForm = () => {
  const location = useLocation();
  const answer = location.state?.answer;
  const questionId = location.state?.questionId;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [content, setContent] = useState(answer?.content || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.put(`/api/v1/answers/${answer.id}`, { content });
      navigate(`/question/${questionId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={commonStyles.container}>
      <h2>답변 수정</h2>
      <Button onClick={() => navigate('/')}>목록으로</Button>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <div style={commonStyles.formGroup}>
          <label htmlFor="content">내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={commonStyles.textarea}
            required
          />
        </div>

        <div style={commonStyles.buttonGroup}>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            variant="secondary"
          >
            취소
          </Button>
          <Button type="submit">
            수정하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnswerModifyForm;