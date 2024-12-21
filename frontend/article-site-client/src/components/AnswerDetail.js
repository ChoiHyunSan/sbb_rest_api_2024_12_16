import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
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
      setError('댓글을 작성���려면 로그인이 필요합니다.');
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
    return <div>답변 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={commonStyles.container}>
      <h2>답변 상세</h2>
      <Button onClick={() => navigate(-1)}>
        질문으로 돌아가기
      </Button>

      {/* 답변 내용 표시 */}
      <div style={commonStyles.answerContent}>
        <h3>답변 내용</h3>
        <p>{answer.content}</p>
        <div style={commonStyles.answerMeta}>
          <small>
            작성자: {answer.author} | 
            작성일: {new Date(answer.createdAt).toLocaleDateString()} | 
            추천수: {answer.voter?.length || 0}
          </small>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div style={commonStyles.commentSection}>
        <h3>댓글 목록</h3>
        <div style={commonStyles.commentList}>
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} style={commonStyles.commentItem}>
                <p>{comment.content}</p>
                <small>
                  작성자: {comment.author} | 
                  작성일: {new Date(comment.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <div style={commonStyles.emptyMessage}>
              아직 작성된 댓글이 없습니다.
            </div>
          )}
        </div>

        <ErrorMessage message={error} />
        
        <form onSubmit={handleSubmitComment} style={commonStyles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력해주세요"
            style={commonStyles.textarea}
            required
          />
          <Button type="submit">
            댓글 등록
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AnswerDetail; 