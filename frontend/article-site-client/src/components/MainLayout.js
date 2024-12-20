// components/MainLayout.js
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={commonStyles.container}>
      <nav style={styles.nav}>
        <div style={styles.leftNav}>
          <Button onClick={() => navigate('/list')}>질문 목록</Button>
          {user && (
            <Button onClick={() => navigate('/question/new')}>질문 작성</Button>
          )}
        </div>
        <div style={styles.rightNav}>
          {user ? (
            <>
              <span style={styles.username}>{user.username}님</span>
              <Button onClick={() => navigate('/profile')}>프로필</Button>
              <Button onClick={() => navigate('/update-password')}>비밀번호 변경</Button>
              <Button onClick={handleLogout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')}>로그인</Button>
              <Button onClick={() => navigate('/signup')}>회원가입</Button>
              <Button onClick={() => navigate('/find-password')}>비밀번호 찾기</Button>
            </>
          )}
        </div>
      </nav>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    marginBottom: '2rem'
  },
  leftNav: {
    display: 'flex',
    gap: '1rem'
  },
  rightNav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  username: {
    marginRight: '1rem',
    fontWeight: 'bold'
  },
  main: {
    padding: '20px'
  }
};

export default MainLayout;