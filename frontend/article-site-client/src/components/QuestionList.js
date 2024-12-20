import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { usePagination } from '../hooks/usePagination';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { PAGE_SIZE } from '../config/constants';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [searchInput, setSearchInput] = useState('');
  const { page, nextPage, prevPage, setPage } = usePagination(0);
  const navigate = useNavigate();

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        kw: keyword,
        sort
      });

      const response = await api.get(`/api/v1/questions?${queryParams}`);
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, sort]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  };

  const getDisplayNumber = (index) => {
    return (page * PAGE_SIZE) + index + 1;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!questions || questions.length === 0) return <div>질문이 없습니다.</div>;

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.controls}>
        <form onSubmit={handleSearch} style={commonStyles.searchForm}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="검색어를 입력하세요"
            style={commonStyles.input}
          />
          <Button type="submit">검색</Button>
          <Button onClick={() => navigate('/question/new')}>
            글 작성하기
          </Button>
        </form>
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={commonStyles.select}
        >
          <option value="createdAt">최신순</option>
          <option value="views">조회수순</option>
        </select>
      </div>

      <ErrorMessage message={error} />

      <table style={commonStyles.table}>
        <thead>
          <tr>
            <th style={commonStyles.tableHeader}>번호</th>
            <th style={commonStyles.tableHeader}>제목</th>
            <th style={commonStyles.tableHeader}>작성자</th>
            <th style={commonStyles.tableHeader}>조회수</th>
            <th style={commonStyles.tableHeader}>작성일시</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.id} style={commonStyles.tableRow}>
              <td style={commonStyles.tableCell}>{getDisplayNumber(index)}</td>
              <td style={commonStyles.tableCell}>
                <Link 
                  to={`/question/${question.id}`} 
                  style={commonStyles.link}
                >
                  {question.subject}
                </Link>
              </td>
              <td style={commonStyles.tableCell}>{question.author}</td>
              <td style={commonStyles.tableCell}>{question.views}</td>
              <td style={commonStyles.tableCell}>{formatDate(question.updateAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={commonStyles.pagination}>
        <Button
          onClick={prevPage}
          disabled={page === 0}
        >
          이전
        </Button>
        <span>페이지 {page + 1}</span>
        <Button
          onClick={nextPage}
          disabled={questions.length < PAGE_SIZE}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;