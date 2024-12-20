import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useFormError } from '../hooks/useFormError';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const { generalError, handleError } = useFormError();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/v1/user/profile');
        console.log('Profile data:', response.data);
        setProfile(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>프로필 로딩중...</div>;

  return (
    <div style={commonStyles.container}>
      <h2>내 프로필</h2>
      
      {/* 사용자 기본 정보 */}
      <div style={styles.section}>
        <h3>기본 정보</h3>
        <div style={styles.profileSection}>
          <div style={styles.profileItem}>
            <label>사용자명:</label>
            <span>{profile.userProfileRequest.name}</span>
          </div>
          <div style={styles.profileItem}>
            <label>이메일:</label>
            <span>{profile.userProfileRequest.email}</span>
          </div>
          <div style={styles.profileItem}>
            <label>가입일:</label>
            <span>{new Date(profile.userProfileRequest.createDate).toLocaleString()}</span>
          </div>
          <div style={styles.profileItem}>
            <label>마지막 수정일:</label>
            <span>{new Date(profile.userProfileRequest.modifyDate).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 질문 목록 */}
      <div style={styles.section}>
        <h3>작성한 질문 ({profile.questionProfileRequest.length})</h3>
        <div style={styles.listSection}>
          {profile.questionProfileRequest.map((question, index) => (
            <div key={index} style={styles.listItem}>
              <span style={styles.title}>{question.subject}</span>
              <span style={styles.date}>
                {new Date(question.createDate).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 답변 목록 */}
      <div style={styles.section}>
        <h3>작성한 답변 ({profile.answerProfileRequest.length})</h3>
        <div style={styles.listSection}>
          {profile.answerProfileRequest.map((answer, index) => (
            <div key={index} style={styles.listItem}>
              <span style={styles.content}>{answer.content}</span>
              <span style={styles.date}>
                {new Date(answer.createDate).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {generalError && <ErrorMessage message={generalError} />}

      <div style={styles.buttonSection}>
        <Button onClick={() => navigate('/list')}>목록으로</Button>
        <Button onClick={() => navigate('/user/edit')}>프로필 수정</Button>
      </div>
    </div>
  );
};

const styles = {
  section: {
    marginBottom: '2rem'
  },
  profileSection: {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '8px',
    marginTop: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  profileItem: {
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '0.5rem'
  },
  listSection: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #dee2e6'
  },
  title: {
    fontWeight: 'bold',
    flex: 1
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  date: {
    color: '#6c757d',
    fontSize: '0.9rem',
    marginLeft: '1rem'
  },
  buttonSection: {
    marginTop: '2rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  }
};

export default ProfilePage; 