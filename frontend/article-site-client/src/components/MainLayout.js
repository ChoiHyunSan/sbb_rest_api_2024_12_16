// components/MainLayout.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionList from "./QuestionList";


const MainLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 상태 확인
        fetch('http://localhost:8080/api/v1/user/status', {
            credentials: 'include',
        })
            .then(response => {
                setIsAuthenticated(response.ok);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    function handleSignup() {
        navigate('/signup');
    }

    return (
        <div>
            <nav>
                {isAuthenticated ? (
                    <button onClick={handleLogout}>로그아웃</button>
                ) : (
                    <button onClick={handleLogin}>로그인</button>
                )}
                <button onClick={handleSignup}>회원 가입</button>
            </nav>
            <main>
                <QuestionList/>
            </main>
        </div>
    );
};

export default MainLayout;