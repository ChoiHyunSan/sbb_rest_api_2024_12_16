import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordCheck: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호 확인 체크
        if(formData.password !== formData.passwordCheck) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/v1/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password1: formData.password,
                    password2: formData.passwordCheck
                })
            });

            if (response.ok) {
                navigate('/login');  // 회원가입 성공시 로그인 페이지로 이동
            } else {
                const data = await response.json();
                setError(data.message || '회원가입에 실패했습니다.');
            }
        } catch (err) {
            setError('서버 연결에 실패했습니다.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>회원가입</h2>
            <button onClick={() => {
                navigate('/')
            }}> 목록으로
            </button>
            <form onSubmit={handleSubmit}>
                {error && <div style={errorStyle}>{error}</div>}

                <div style={formGroupStyle}>
                    <label htmlFor="username">사용자 이름:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="passwordCheck">비밀번호 확인:</label>
                    <input
                        type="password"
                        id="passwordCheck"
                        name="passwordCheck"
                        value={formData.passwordCheck}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <button type="submit" style={buttonStyle}>
                    회원가입
                </button>
            </form>
        </div>
    );
};

const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px'
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px'
};

const formGroupStyle = {
    marginBottom: '15px'
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px'
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

const errorStyle = {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center'
};

export default SignupForm;