import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

const QuestionModifyForm = () => {
    const location = useLocation();
    const question = location.state?.question;
    const navigate = useNavigate();

    // 초기값 설정
    const [formData, setFormData] = useState({
        subject: question?.subject || '',
        content: question?.content || '',
        categoryId: question?.category?.id || ''
    });
    const [categories, setCategories] = useState([]);

    const { subject, content, categoryId } = formData;

    useEffect(() => {
        fetchCategories();
    }, []);

    const alertShown = useRef(false);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/questions/new', {
                credentials: 'include'
            });

            if (response.status === 401 && !alertShown.current) {
                alertShown.current = true;
                alert("로그인을 먼저 해주세요");
                navigate('/');
                return;
            }

            if (!response.ok) {
                throw new Error('카테고리를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 선택된 카테고리 객체 찾기
            const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId));

            if (!selectedCategory) {
                alert('카테고리를 선택해주세요.');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/v1/questions/${question.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject,
                    content,
                    category: selectedCategory // 전체 카테고리 객체 전송
                }),
                credentials: 'include'
            });

            if (response.ok) {
                navigate(`/question/${question.id}`);
            } else {
                alert('질문 수정에 실패했습니다.');
            }
        } catch (err) {
            console.error(err);
            alert('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div style={containerStyle}>
            <h2>질문 수정</h2>
            <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                    <label htmlFor="categoryId">카테고리:</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={categoryId}
                        onChange={handleChange}
                        style={selectStyle}
                        required
                    >
                        <option value="">카테고리를 선택하세요</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="subject">제목:</label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={subject}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={content}
                        onChange={handleChange}
                        style={textareaStyle}
                        required
                    />
                </div>

                <div style={buttonContainerStyle}>
                    <button type="button" onClick={() => navigate(-1)} style={cancelButtonStyle}>
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

const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
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

const selectStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
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

export default QuestionModifyForm;