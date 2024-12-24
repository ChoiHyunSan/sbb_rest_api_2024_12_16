import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { formatDate } from '../utils/dateFormatter';
import { PAGE_SIZE } from '../config/constants';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);

  const fetchQuestions = async (page) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/questions?page=${page}&size=${PAGE_SIZE}`);
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setQuestions(response.data);
        setHasNextPage(response.data.length === PAGE_SIZE);
      } else {
        setQuestions([]);
        setHasNextPage(false);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('질문 목록을 불러오는데 실패했습니다.');
      setQuestions([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-gray-600">로딩중...</div>
    </div>
  );

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">질문 목록</h2>
        <Link to="/question/new">
          <Button>질문 작성</Button>
        </Link>
      </div>

      {(!questions || questions.length === 0) ? (
        <div className="text-center py-8 text-gray-500">
          아직 작성된 질문이 없습니다.
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map(question => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/question/${question.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {question.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {question.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(question.updateAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center space-x-4 mt-6">
            <Button 
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              variant="secondary"
            >
              이전
            </Button>
            <span className="text-gray-700">
              페이지 {currentPage + 1}
            </span>
            <Button 
              onClick={handleNextPage}
              disabled={!hasNextPage}
              variant="secondary"
            >
              다음
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionList;
