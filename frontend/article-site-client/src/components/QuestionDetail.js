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
  const [question, setQuestion] = useState(null);
  const [answerPage, setAnswerPage] = useState(0);
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFirstRender = useRef(true);
  const [totalPages, setTotalPages] = useState(0);

  const fetchQuestionDetail = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        answerPage,
        sort
      });

      const response = await api.get(`/api/v1/questions/${id}?${queryParams}`);
      setQuestion(response.data);
      setTotalPages(response.data.answerPage.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, answerPage, sort]);

  useEffect(() => {
    fetchQuestionDetail();
  }, [fetchQuestionDetail]);

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

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/api/v1/questions/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

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
    if (answerPage > 0) {
      setAnswerPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (answerPage < totalPages - 1) {
      setAnswerPage(prev => prev + 1);
    }
  };

  const handleModify = () => {
    navigate(`/question/modify/${id}`, { 
      state: { 
        question: {
          id,
          subject: question.subject,
          content: question.content,
          category: question.category
        } 
      }
    });
  };

  if (loading) return <div>로딩중...</div>;
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
              <Button onClick={handleModify}>
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
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={commonStyles.select}
          >
            <option value="latest">최신순</option>
            <option value="likes">추천순</option>
          </select>
        </div>

        <AnswerInput id={id} onAnswerSubmit={fetchQuestionDetail} />

        {question.answerPage.content.map((answer) => (
          <div key={answer.id} style={styles.answer}>
            <div style={styles.answerContent}>{answer.content}</div>
            <div style={styles.answerMeta}>
              <span>작성자: {answer.author}</span>
              <span>좋아요: {answer.likes}</span>
              <span>작성일: {formatDate(answer.createDate)}</span>
              {answer.modifyDate && (
                <span>수정일: {formatDate(answer.modifyDate)}</span>
              )}
            </div>
            
            <div style={styles.buttonGroup}>
              <Button onClick={() => handleAnswerVote(answer.id)}>
                추천
              </Button>
              {user?.username === answer.author && (
                <>
                  <Button
                    onClick={() => handleAnswerDelete(answer.id)}
                    variant="secondary"
                  >
                    삭제
                  </Button>
                  <Button
                    onClick={() => navigate(`/answer/modify/${answer.id}`, {
                      state: { 
                        answer: {
                          id: answer.id,
                          content: answer.content
                        },
                        questionId: id 
                      }
                    })}
                  >
                    수정
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}

        <div style={commonStyles.pagination}>
          <Button
            onClick={handlePrevPage}
            disabled={answerPage === 0}
          >
            이전
          </Button>
          <span>
            페이지 {answerPage + 1} / {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={answerPage >= totalPages - 1}
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