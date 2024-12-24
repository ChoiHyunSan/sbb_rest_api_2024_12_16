import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';

const AnswerDetail = () => {
  const { answerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const answer = location.state?.answer;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [answerId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/v1/answers/comment/${answerId}`);
      setComments(response.data);
    } catch (err) {
      setError('댓글을 불러오는데 실패했습니다.');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      await api.post(`/api/v1/answers/comment/${answerId}`, {
        content: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!answer) {
    return <div className="text-center py-8">답변 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">답변 상세</h2>
      <Button 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        질문으로 돌아가기
      </Button>

      {/* 답변 내용 표시 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">답변 내용</h3>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{answer.content}</p>
        <div className="text-sm text-gray-500">
          <span className="mr-4">작성자: {answer.author}</span>
          <span className="mr-4">작성일: {new Date(answer.createdAt).toLocaleDateString()}</span>
          <span>추천수: {answer.voter?.length || 0}</span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">댓글 목록</h3>
        <div className="space-y-4 mb-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div 
                key={comment.id} 
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <p className="text-gray-700 mb-2">{comment.content}</p>
                <div className="text-sm text-gray-500">
                  <span className="mr-4">작성자: {comment.author}</span>
                  <span>작성일: {new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              아직 작성된 댓글이 없습니다.
            </div>
          )}
        </div>

        <ErrorMessage message={error} />
        
        <form onSubmit={handleSubmitComment} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            rows={4}
          />
          <Button 
            type="submit"
            className="mt-4"
          >
            댓글 등록
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AnswerDetail; 