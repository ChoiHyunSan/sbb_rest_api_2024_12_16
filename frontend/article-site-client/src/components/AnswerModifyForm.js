import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AnswerModifyForm = () => {
    const location = useLocation();
    const answer = location.state?.answer;
    const questionId = location.state?.questionId;
    const navigate = useNavigate();

    const [content, setContent] = useState(answer?.content || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/v1/answers/${answer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
                credentials: 'include'
            });

            if (response.ok) {
                navigate(`/question/${questionId}`);
            } else {
                alert('답변 수정에 실패했습니다.');
            }
        } catch (err) {
            console.error(err);
            alert('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div style={containerStyle}>
            <button onClick={() => {
                navigate('/')
            }}> 목록으로
            </button>
            <h2>답변 수정</h2>
            <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={textareaStyle}
                        required
                    />
                </div>

                <div style={buttonContainerStyle}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={cancelButtonStyle}
                    >
                        취소
                    </button>
                    <button type="submit" style={submitButtonStyle}>
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
};

const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
};

const formGroupStyle = {
    marginBottom: '20px'
};

const textareaStyle = {
    width: '100%',
    height: '200px',
    padding: '8px',
    marginTop: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical'
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
};

const submitButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

const cancelButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

export default AnswerModifyForm;