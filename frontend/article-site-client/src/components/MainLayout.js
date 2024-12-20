// components/MainLayout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionList from './QuestionList';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';
import { commonStyles } from '../styles/commonStyles';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={commonStyles.container}>
      <nav style={commonStyles.nav}>
        {user ? (
          <>
            <span>Welcome, {user.username}!</span>
            <Button onClick={handleLogout} variant="secondary">
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/login')}>로그인</Button>
            <Button onClick={() => navigate('/signup')}>회원 가입</Button>
          </>
        )}
      </nav>
      <main>
        <QuestionList />
      </main>
    </div>
  );
};

export default MainLayout;