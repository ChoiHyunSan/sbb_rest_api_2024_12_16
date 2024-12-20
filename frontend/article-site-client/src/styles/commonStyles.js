// 공통으로 사용되는 스타일 정의
export const commonStyles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  
  button: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white', 
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },

  input: {
    width: '100%',
    padding: '8px',
    marginTop: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },

  textarea: {
    width: '100%',
    minHeight: '150px',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical'
  },

  formGroup: {
    marginBottom: '20px'
  },

  errorMessage: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },

  tableHeader: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left'
  },

  tableRow: {
    borderBottom: '1px solid #dee2e6'
  },

  tableCell: {
    padding: '12px'
  },

  link: {
    textDecoration: 'none',
    color: '#2c3e50'
  },

  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },

  searchForm: {
    display: 'flex',
    gap: '10px'
  },

  select: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white'
  },

  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    gap: '10px'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px'
  },

  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },

  nav: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '10px 0',
    marginBottom: '20px'
  }
}; 