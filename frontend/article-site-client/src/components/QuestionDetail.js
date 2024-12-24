import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import AnswerInput from './AnswerInput';
import { formatDate } from '../utils/dateFormatter';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);

  const fetchQuestionDetail = async () => {
    try {
      const response = await api.get(`/api/v1/questions/${id}`);
      setQuestion(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchQuestionDetail();
  }, [id]);

  useEffect(() => {
    const incrementViews = async () => {
      try {
        await api.post(`/api/v1/questions/${id}/views`);
      } catch (err) {
        setError(err.message);
      }
    };

    incrementViews();
  }, [id]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    
    try {
      await api.delete(`/api/v1/questions/${id}`);
      navigate('/list');
    } catch (error) {
      setError('질문 삭제에 실패했습니다.');
    }
  }, [id, navigate]);

  const handleVote = async () => {
    try {
      await api.post(`/api/v1/questions/vote/${id}`);
      await fetchQuestionDetail();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnswerDelete = async (answerId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/api/v1/answers/${answerId}`);
      await fetchQuestionDetail();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnswerVote = async (answerId) => {
    try {
      await api.post(`/api/v1/answers/vote/${answerId}`);
      await fetchQuestionDetail();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrevPage = () => {
    if (question.answerPage.currentPage > 0) {
      question.answerPage.currentPage -= 1;
    }
  };

  const handleNextPage = () => {
    if (question.answerPage.currentPage < question.answerPage.totalPages - 1) {
      question.answerPage.currentPage += 1;
    }
  };

  const handleEdit = useCallback(() => {
    navigate(`/question/modify/${id}`);
  }, [id, navigate]);

  if (error) return <ErrorMessage message={error} />;
  if (!question) return <div>질문을 찾을 수 없습니다.</div>;

  return (
    <div style={commonStyles.container}>
      <Button onClick={() => navigate('/')}>목록으로</Button>
      
      <div style={styles.questionSection}>
        <h1 style={styles.title}>{question.subject}</h1>
        <div style={styles.meta}>
          <span>작성자: {question.author}</span>
          <span>조회수: {question.views}</span>
          <span>좋아요: {question.likes}</span>
          <span>작성일: {formatDate(question.createDate)}</span>
          {question.modifyDate && (
            <span>수정일: {formatDate(question.modifyDate)}</span>
          )}
        </div>
        
        <div style={styles.content}>{question.content}</div>
        
        <div style={styles.buttonGroup}>
          <Button onClick={handleVote}>추천</Button>
          {user?.username === question.author && (
            <>
              <Button onClick={handleDelete} variant="secondary">
                삭제
              </Button>
              <Button onClick={handleEdit}>
                수정
              </Button>
            </>
          )}
        </div>
      </div>

      <div style={styles.answersSection}>
        <div style={styles.answerHeader}>
          <h2>답변 {question.answerCount}개</h2>
          <select
            value={question.answerPage.sort}
            onChange={(e) => question.answerPage.sort = e.target.value}
            style={commonStyles.select}
          >
            <option value="latest">최신순</option>
            <option value="likes">추천순</option>
          </select>
        </div>

        <div>
          <h3>답변 목록</h3>
          {question.answerPage.content.map(answer => (
            <div key={answer.id} style={commonStyles.answerItem}>
              <p>{answer.content}</p>
              <div style={commonStyles.answerMeta}>
                <small>
                  작성자: {answer.author} | 
                  작성일: {new Date(answer.createdAt).toLocaleDateString()}
                </small>
                <Button 
                  onClick={() => navigate(`/answer/${answer.id}/comments`, { 
                    state: { answer } 
                  })}
                  variant="secondary"
                >
                  댓글보기
                </Button>
              </div>
            </div>
          ))}
        </div>

        <AnswerInput id={id} onAnswerSubmit={fetchQuestionDetail} />

        <div style={commonStyles.pagination}>
          <Button
            onClick={handlePrevPage}
            disabled={question.answerPage.currentPage === 0}
          >
            이전
          </Button>
          <span>
            페이지 {question.answerPage.currentPage + 1} / {question.answerPage.totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={question.answerPage.currentPage >= question.answerPage.totalPages - 1}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  questionSection: {
    marginBottom: '40px'
  },
  title: {
    fontSize: '24px',
    marginBottom: '16px'
  },
  meta: {
    display: 'flex',
    gap: '16px',
    color: '#666',
    marginBottom: '16px'
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    padding: '10px 0',
    justifyContent: 'flex-end'
  },
  answersSection: {
    borderTop: '2px solid #eee',
    paddingTop: '20px'
  },
  answerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  answer: {
    padding: '20px',
    borderBottom: '1px solid #eee'
  },
  answerContent: {
    marginBottom: '12px'
  },
  answerMeta: {
    display: 'flex',
    gap: '16px',
    color: '#666',
    fontSize: '14px'
  }
};

export default QuestionDetail;