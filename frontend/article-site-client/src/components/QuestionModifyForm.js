import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';
import { useFormError } from '../hooks/useFormError';

const QuestionModifyForm = () => {
  const location = useLocation();
  const question = location.state?.question;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { errors, generalError, handleError, clearErrors } = useFormError();
  const [formData, setFormData] = useState({
    subject: question?.subject || '',
    content: question?.content || '',
    category: question?.category?.id || null
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    try {
      const submitData = {
        ...formData,
        category: {
          id: parseInt(formData.category)
        }
      };

      await api.put(`/api/v1/questions/${question.id}`, submitData);
      navigate(`/question/${question.id}`);
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

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={commonStyles.container}>
      <h2>질문 수정</h2>
      <Button onClick={() => navigate(-1)}>뒤로가기</Button>
      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} style={commonStyles.form}>
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

        <div style={commonStyles.buttonGroup}>
          <Button type="submit">수정하기</Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionModifyForm;