import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import AnswerInput from "./AnswerInput"

const QuestionDetail = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [answerPage, setAnswerPage] = useState(0);
    const [sort, setSort] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchQuestionDetail = async () => {
        try {
            const queryParams = new URLSearchParams({
                answerPage: answerPage,
                sort: sort
            });

            const response = await fetch(
                `http://localhost:8080/api/v1/questions/${id}?${queryParams}`
            );

            if (!response.ok) {
                throw new Error('질문을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setQuestion(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const increaseViews = async () => {
        // try {
        //     await fetch(`http://localhost:8080/api/v1/questions/${id}/views`, {
        //         method: 'POST',
        //         credentials: 'include'
        //     });
        // } catch (err) {
        //     console.error('조회수 증가 실패:', err);
        // }
    };

    useEffect(() => {
        const init = async () => {
            await increaseViews();
            fetchQuestionDetail();
        };
        init();
    }, [id]);

    useEffect(() => {
        if (!loading) {
            fetchQuestionDetail();
        }
    }, [sort, answerPage]);

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
    if (error) return <div>에러 발생: {error}</div>;
    if (!question) return <div>질문을 찾을 수 없습니다.</div>;

    async function deleteQuestion() {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                const response = await fetch("http://localhost:8080/api/v1/questions/" + id, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (response.ok) {
                    navigate('/')
                }
            } catch (err) {
                console.log(err);
                alert('서버 연결 실패');
            }
        }
    }

    function modifyQuestion() {
        navigate('/question/modify', {
            state: { question }
        });
    }

    async function VoteQuestion() {
        try {
            const response = await fetch("http://localhost:8080/api/v1/questions/vote/" + id, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                fetchQuestionDetail();
            }
        } catch (err) {
            console.log(err);
            alert('서버 연결 실패');
        }
    }

    async function deleteAnswer(answerId) {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                const response = await fetch("http://localhost:8080/api/v1/answers/" + answerId, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (response.ok) {
                    fetchQuestionDetail();
                }
            } catch (err) {
                console.log(err);
                alert('서버 연결 실패');
            }
        }
    }

    function modifyAnswer(answer) {
        navigate('/answer/modify', {
            state: {
                answer,
                questionId: id
            }
        });
    }

    async function VoteAnswer(answerId) {
        try {
            const response = await fetch("http://localhost:8080/api/v1/answers/vote/" + answerId, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                fetchQuestionDetail();
            }
        } catch (err) {
            console.log(err);
            alert('서버 연결 실패');
        }
    }

    function handleSortValue(value) {
        setSort(value);
    }

    return (
        <div style={containerStyle}>
            <button onClick={() => {
                navigate('/')
            }}> 목록으로
            </button>
            {/* 질문 내용 */}
            <div style={questionStyle}>
                <h1 style={titleStyle}>{question.subject}</h1>
                <div style={metaStyle}>
                    <span>작성자: {question.author}</span>
                    <span>조회수: {question.views}</span>
                    <span>좋아요: {question.likes}</span>
                    <span>작성일: {formatDate(question.createDate)}</span>
                    {question.modifyDate && (
                        <span>수정일: {formatDate(question.modifyDate)}</span>
                    )}
                </div>
                <div style={contentStyle}>{question.content}</div>
                <div style={{display: 'flex', gap: '10px', padding: '10px 0', justifyContent: "flex-end"}}>
                    <button
                        onClick={() => VoteQuestion()}>
                        추천
                    </button>
                    <button
                        onClick={() => deleteQuestion()}
                        style={buttonStyle}> 삭제
                    </button>
                    <button
                        onClick={() => modifyQuestion()}
                        style={buttonStyle}> 수정
                    </button>
                </div>
            </div>

            {/* 답변 섹션 */}
            <div style={answersStyle}>
                <div style={answerHeaderStyle}>
                    <h2>답변 {question.answerCount}개</h2>
                    <select
                        value={sort}
                        onChange={(e) => handleSortValue(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="latest">최신순</option>
                        <option value="likes">추천순</option>
                    </select>
                </div>

                {/* 답변 입력 폼 */}
                <AnswerInput id={id} onAnswerSubmit={fetchQuestionDetail}/>

                {/* 답변 목록 */}
                {question.answerPage.content.map((answer) => (
                    <div key={answer.id} style={answerStyle}>
                        <div style={answerContentStyle}>{answer.content}</div>
                        <div style={answerMetaStyle}>
                            <span>작성자: {answer.author}</span>
                            <span>좋아요: {answer.likes}</span>
                            <span>작성일: {formatDate(answer.createDate)}</span>
                            {answer.modifyDate && (
                                <span>수정일: {formatDate(answer.modifyDate)}</span>
                            )}
                        </div>
                        <div style={{display: 'flex', gap: '10px', padding: '10px 0', justifyContent: "flex-end"}}>
                            <button
                                onClick={() => VoteAnswer(answer.id)}>
                                추천
                            </button>
                            <button
                                onClick={() => deleteAnswer(answer.id)}
                                style={buttonStyle}> 삭제
                            </button>
                            <button
                                onClick={() => modifyAnswer(answer)}
                                style={buttonStyle}> 수정
                            </button>
                        </div>
                    </div>
                ))}

                {/* 페이지네이션 */}
                <div style={paginationStyle}>
                    <button
                        onClick={() => setAnswerPage(Math.max(0, answerPage - 1))}
                        disabled={answerPage === 0}
                        style={buttonStyle}
                    >
                        이전
                    </button>
                    <span>페이지 {answerPage + 1}</span>
                    <button
                        onClick={() => setAnswerPage(answerPage + 1)}
                        disabled={!question.answerPage.hasNext}
                        style={buttonStyle}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
};

const questionStyle = {
    marginBottom: '40px'
};

const titleStyle = {
    fontSize: '24px',
    marginBottom: '16px'
};

const metaStyle = {
    display: 'flex',
    gap: '16px',
    color: '#666',
    marginBottom: '16px'
};

const contentStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
};

const answersStyle = {
    borderTop: '2px solid #eee',
    paddingTop: '20px'
};

const answerHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
};

const selectStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
};

const answerStyle = {
    padding: '20px',
    borderBottom: '1px solid #eee'
};

const answerContentStyle = {
    marginBottom: '12px'
};

const answerMetaStyle = {
    display: 'flex',
    gap: '16px',
    color: '#666',
    fontSize: '14px'
};

const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px'
};

const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    disabled: {
        backgroundColor: '#ccc'
    }
};

export default QuestionDetail;