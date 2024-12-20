import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';

const QuestionModifyForm = () => {
  const location = useLocation();
  const question = location.state?.question;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    subject: question?.subject || '',
    content: question?.content || '',
    categoryId: question?.category?.id || ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get('/api/v1/questions/new');
      setCategories(data);
    } catch (err) {
      setError(err.message);
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
    setError(null);

    try {
      const selectedCategory = categories.find(
        cat => cat.id === parseInt(formData.categoryId)
      );

      if (!selectedCategory) {
        setError('카테고리를 선택해주세요.');
        return;
      }

      await api.put(`/api/v1/questions/${question.id}`, {
        subject: formData.subject,
        content: formData.content,
        category: selectedCategory
      });

      navigate(`/question/${question.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={commonStyles.container}>
      <h2>질문 수정</h2>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <div style={commonStyles.formGroup}>
          <label htmlFor="categoryId">카테고리:</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            style={commonStyles.select}
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

        <div style={commonStyles.formGroup}>
          <label htmlFor="subject">제목:</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
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
        </div>

        <div style={commonStyles.buttonGroup}>
          <Button 
            type="button" 
            onClick={() => navigate(-1)}
            variant="secondary"
          >
            취소
          </Button>
          <Button type="submit">
            수정하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionModifyForm;