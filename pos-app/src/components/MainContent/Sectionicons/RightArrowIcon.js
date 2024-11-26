import React from 'react';

export default function RightArrowIcon({ onClick }) {
  return (
    <svg onClick={onClick} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
      <path d="M12.1399 8.75258L6.6585 13.5488C6.01192 14.1146 5 13.6554 5 12.7962L5 3.20377C5 2.34461 6.01192 1.88543 6.6585 2.45119L12.1399 7.24743C12.5952 7.64584 12.5952 8.35417 12.1399 8.75258Z" fill="black"/>
    </svg>
  );
}
