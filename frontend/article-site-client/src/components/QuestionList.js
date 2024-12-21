import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { formatDate } from '../utils/dateFormatter';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/api/v1/questions');
      console.log('Questions response:', response.data);
      setQuestions(response.data);
    } catch (err) {
      setError('질문 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h2>질문 목록</h2>
      
      <Link to="/question/new">
        <Button>질문 작성</Button>
      </Link>

      {questions.length === 0 ? (
        <div style={commonStyles.emptyMessage}>
          아직 작성된 질문이 없습니다.
        </div>
      ) : (
        <table style={commonStyles.table}>
          <thead>
            <tr>
              <th style={commonStyles.tableHeader}>제목</th>
              <th style={commonStyles.tableHeader}>작성자</th>
              <th style={commonStyles.tableHeader}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.id} style={commonStyles.tableRow}>
                <td style={commonStyles.tableCell}>
                  <Link to={`/question/${question.id}`} style={commonStyles.link}>
                    {question.subject}
                  </Link>
                </td>
                <td style={commonStyles.tableCell}>{question.author}</td>
                <td style={commonStyles.tableCell}>
                  {formatDate(question.updateAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuestionList;
