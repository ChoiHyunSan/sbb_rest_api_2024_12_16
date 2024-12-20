import React, { useState,  } from 'react';

const AnswerInput = ({id, onAnswerSubmit}) => {

    const [content , setContent] = useState('');

    const fetchAnswerForm = async (e) => {
        e.preventDefault();

        try{
            const formData = new URLSearchParams();
            formData.append('content', content);

            const response = await  fetch('http://localhost:8080/api/v1/answers/' + id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // JSON 형식으로 변경
                },
                body: JSON.stringify({ content: content }), // 데이터를 JSON 형식으로 변환
                credentials: 'include',
            });

            if(response.ok){
                setContent(''); // 폼 초기화
                onAnswerSubmit();
            }else{
                alert('답변 작성에 실패했습니다.');
            }

        }catch (err){
            console.log(err);
            alert('서버 연결 실패');
        }
    }

    return (
        <>
            <div style={containerStyle}>
                <h3>답변 작성</h3>
                <form onSubmit={fetchAnswerForm}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="답변을 입력해주세요"
                    style={textareaStyle}
                    required
                />
                    <button type="submit" style={buttonStyle}>
                        답변 등록
                    </button>
                </form>
            </div>
        </>
    )
}

const containerStyle = {
    margin: '20px 0',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa'
};

const textareaStyle = {
    width: '100%',
    minHeight: '150px',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical'
};

const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    float: 'right'
};

export default AnswerInput;