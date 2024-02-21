import React, { useEffect } from 'react';
import './LinkButton.css';

const LinkButton = ({ children, ...props }) => {
  const { onClick, disabled } = props;

  return (
    <button className="link-button ms-2" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default LinkButton;