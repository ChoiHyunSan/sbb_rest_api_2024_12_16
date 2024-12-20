import { useState } from 'react';

export const usePagination = (initialPage = 0) => {
  const [page, setPage] = useState(initialPage);
  
  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(0, prev - 1));
  const resetPage = () => setPage(0);

  return {
    page,
    nextPage,
    prevPage,
    resetPage,
    setPage
  };
}; 