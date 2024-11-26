import React from 'react';
import styles from './CommonButton.module.css';

function CommonButton({
  children,
  onClick,
  variant = 'default', // default, detail, option
  isActive = false,
  className,
  ...props
}) {
  const buttonClasses = `
    ${styles.button}
    ${styles[variant]}
    ${isActive ? styles.active : ''}
    ${className || ''}
  `.trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default CommonButton; 