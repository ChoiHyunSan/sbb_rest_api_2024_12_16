import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useFormError } from '../hooks/useFormError';

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    category: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { errors, generalError, handleError, clearErrors } = useFormError();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/questions/new');
        setCategories(response.data || []);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    // 제목 검증
    if (!formData.subject?.trim()) {
      errors.subject = '제목은 필수항목입니다';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = '제목은 3자 이상이어야 합니다';
    }

    // 내용 검증
    if (!formData.content?.trim()) {
      errors.content = '내용은 필수항목입니다';
    } else if (formData.content.trim().length < 10) {
      errors.content = '내용은 10자 이상이어야 합니다';
    }

    // 카테고리 검증
    if (!formData.category) {
      errors.category = '카테고리는 필수항목입니다';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    // 폼 유효성 검사
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // useFormError hook의 handleError를 사용하여 에러 표시
      handleError({ response: { data: { errors: validationErrors } } });
      return;
    }

    try {
      const submitData = {
        ...formData,
        category: {
          id: parseInt(formData.category)
        }
      };

      await api.post('/api/v1/questions', submitData);
      navigate('/list');
    } catch (error) {
      handleError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>카테고리 로딩중...</div>;

  return (
    <div style={commonStyles.container}>
      <h2>질문 작성</h2>
      <Button onClick={() => navigate('/')}>목록으로</Button>
      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} style={commonStyles.form} noValidate>
        <div style={commonStyles.formGroup}>
          <label htmlFor="category">카테고리:</label>
          <select
            id="category"
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            style={commonStyles.select}
            required
          >
            <option value="">카테고리 선택</option>
            {Array.isArray(categories) && categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <ErrorMessage message={errors.category} />}
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="subject">제목:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
          {errors.subject && <ErrorMessage message={errors.subject} />}
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="content">내용:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            style={commonStyles.textarea}
            required
          />
          {errors.content && <ErrorMessage message={errors.content} />}
        </div>

        <Button type="submit">작성하기</Button>
      </form>
    </div>
  );
};

export default QuestionForm;