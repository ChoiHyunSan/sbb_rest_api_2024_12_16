import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import Button from './common/Button';
import ErrorMessage from './common/ErrorMessage';

const QuestionForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    category: ''
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
      const submitData = {
        ...formData,
        category: {
          id: parseInt(formData.category)
        }
      };

      await api.post('/api/v1/questions', submitData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={commonStyles.container}>
      <h2>질문 작성하기</h2>
      <Button onClick={() => navigate('/')}>목록으로</Button>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={commonStyles.form}>
        <div style={commonStyles.formGroup}>
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={commonStyles.select}
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="subject">제목</label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            style={commonStyles.input}
            required
          />
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            style={commonStyles.textarea}
            required
          />
        </div>

        <Button type="submit">질문 등록</Button>
      </form>
    </div>
  );
};

export default QuestionForm;