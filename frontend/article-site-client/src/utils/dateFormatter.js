export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // createDate와 createdAt 모두 처리
  const date = new Date(dateString);
  
  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString);
    return '';
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 