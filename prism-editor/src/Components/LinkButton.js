import React from 'react';
import './LinkButton.css';

const LinkButton = ({ children, ...props }) => {
  const { onClick, disabled } = props;


  return (
    <button disabled={disabled} className="link-button ms-2" onClick={onClick}>
      {children}
    </button>
  );
};

export default LinkButton;