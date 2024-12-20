import React from 'react';
import PropTypes from 'prop-types';
import { commonStyles } from '../../styles/commonStyles';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
  const buttonStyle = {
    ...commonStyles.button,
    backgroundColor: variant === 'primary' ? '#4CAF50' : '#f44336',
    opacity: disabled ? 0.7 : 1,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={buttonStyle}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool
};

export default Button; 