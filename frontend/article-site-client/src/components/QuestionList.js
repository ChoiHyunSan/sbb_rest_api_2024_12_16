import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [searchInput, setSearchInput] = useState('');

    const ITEMS_PER_PAGE = 10; // 한 페이지당 보여줄 아이템 수
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, [page, keyword, sort]);

    const fetchQuestions = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: page,
                kw: keyword,
                sort: sort
            });

            const response = await fetch(`http://localhost:8080/api/v1/questions?${queryParams}`, {
                // credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('서버에서 데이터를 가져오는데 실패했습니다.');
            }

            const data = await response.json();
            setQuestions(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const getDisplayNumber = (index) => {
        return (page * ITEMS_PER_PAGE) + index + 1;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
        setPage(0);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(0);
    };

    const handleCreateQuestion = async () => {
        navigate('/question/new');
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생: {error}</div>;

    return (
        <div className="question-list" style={{ padding: '20px' }}>
            <div style={controlsContainerStyle}>
                <form onSubmit={handleSearch} style={searchFormStyle}>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>검색</button>
                    <button onClick={handleCreateQuestion} style={buttonStyle}>글 작성하기</button>
                </form>
                <select value={sort} onChange={handleSortChange} style={selectStyle}>
                    <option value="createdAt">최신순</option>
                    <option value="views">조회수순</option>
                </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                <tr>
                    <th style={tableHeaderStyle}>번호</th>
                    <th style={tableHeaderStyle}>제목</th>
                    <th style={tableHeaderStyle}>작성자</th>
                    <th style={tableHeaderStyle}>조회수</th>
                    <th style={tableHeaderStyle}>작성일시</th>
                </tr>
                </thead>
                <tbody>
                {questions.map((question, index) => (
                    <tr key={question.id} style={tableRowStyle}>
                        <td style={tableCellStyle}>{getDisplayNumber(index)}</td>
                        <td style={tableCellStyle}>
                            <Link to={`/question/${question.id}`} style={{ textDecoration: 'none', color: '#2c3e50' }}>
                                {question.subject}
                            </Link>
                        </td>
                        <td style={tableCellStyle}>{question.author}</td>
                        <td style={tableCellStyle}>{question.views}</td>
                        <td style={tableCellStyle}>{formatDate(question.updateAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={paginationStyle}>
                <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    style={buttonStyle}
                >
                    이전
                </button>
                <span style={{ margin: '0 10px' }}>
          {(page * ITEMS_PER_PAGE) + 1} - {(page * ITEMS_PER_PAGE) + questions.length}
        </span>
                <button
                    onClick={() => setPage(page + 1)}
                    style={buttonStyle}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

// 스타일 정의는 동일하게 유지
const controlsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
};

const searchFormStyle = {
    display: 'flex',
    gap: '10px'
};

const inputStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '200px'
};

const selectStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white'
};

const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

const tableHeaderStyle = {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left'
};

const tableRowStyle = {
    borderBottom: '1px solid #dee2e6'
};

const tableCellStyle = {
    padding: '12px'
};

const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px'
};

export default QuestionList;