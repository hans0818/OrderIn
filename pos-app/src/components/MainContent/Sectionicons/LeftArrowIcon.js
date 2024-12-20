import React from 'react';

export default function LeftArrowIcon({ onClick }) {
  return (
    <svg onClick={onClick} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
      <path d="M3.86009 8.75258L9.3415 13.5488C9.98808 14.1146 11 13.6554 11 12.7962V3.20377C11 2.34461 9.98808 1.88543 9.3415 2.45119L3.86009 7.24743C3.40476 7.64584 3.40476 8.35417 3.86009 8.75258Z" fill="black"/>
    </svg>
  );
}
