import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionForm = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        category: ''  // 선택된 카테고리 id 저장
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            category: {
                id: formData.category  // 카테고리 ID를 객체 형태로 감싸기
            }
        };

        try {
            const response = await fetch('http://localhost:8080/api/v1/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                navigate('/');  // 작성 완료 후 홈으로 이동
            } else {
                alert('질문 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('질문 등록 실패:', error);
            alert('서버 연결에 실패했습니다.');
        }
    };

    const alertShown = useRef(false);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/questions/new', {
                    credentials: 'include'
                });

                if (response.status === 401 && !alertShown.current) {  // 인증 실패
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

        fetchCategories();
    }, [navigate]);

    return (
        <div style={containerStyle}>
            <button onClick={() => {
                navigate('/')
            }}> 목록으로
            </button>
            <h2>질문 작성하기</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={formGroupStyle}>
                    <label htmlFor="category">카테고리</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    >
                        <option value="">카테고리 선택</option>
                        {Array.isArray(categories) && categories.map(category => (  // 배열 체크 추가
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="subject">제목</label>
                    <input
                        id="subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        style={textareaStyle}
                        required
                    />
                </div>

                <button type="submit" style={buttonStyle}>
                    질문 등록
                </button>
            </form>
        </div>
    );
};

const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const inputStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px'
};

const textareaStyle = {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '200px',
    resize: 'vertical'
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

export default QuestionForm;