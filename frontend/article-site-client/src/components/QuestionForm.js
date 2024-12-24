import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
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
    
    if (!formData.subject?.trim()) {
      errors.subject = '제목은 필수항목입니다';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = '제목은 3자 이상이어야 합니다';
    }

    if (!formData.content?.trim()) {
      errors.content = '내용은 필수항목입니다';
    } else if (formData.content.trim().length < 10) {
      errors.content = '내용은 10자 이상이어야 합니다';
    }

    if (!formData.category) {
      errors.category = '카테고리는 필수항목입니다';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-gray-600">카테���리 로딩중...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">질문 작성</h2>
        <Button 
          onClick={() => navigate('/')}
          variant="secondary"
        >
          목록으로
        </Button>
      </div>

      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label 
            htmlFor="category" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            카테고리:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div>
          <label 
            htmlFor="subject" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            제목:
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.subject && <ErrorMessage message={errors.subject} />}
        </div>

        <div>
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            내용:
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px]"
            required
          />
          {errors.content && <ErrorMessage message={errors.content} />}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit">
            작성하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;