import React from 'react';
import PropTypes from 'prop-types';
import { commonStyles } from '../../styles/commonStyles';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div style={commonStyles.errorMessage}>
      {message}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string
};

export default ErrorMessage; 