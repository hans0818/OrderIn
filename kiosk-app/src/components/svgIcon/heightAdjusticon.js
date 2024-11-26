import React from 'react';

const HeightAdjustIcon = () => {
  return (
    <svg
      width="40"
      height="32"
      viewBox="0 0 58 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: 'translateY(5px)' }}
    >
      {/* 첫 번째 줄 */}
      <path
        d="M8 14 C29 14, 29 14, 50 14"
        stroke="#4D4D4D"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* 두 번째 줄 */}
      <path
        d="M8 24 C29 24, 29 24, 50 24"
        stroke="#4D4D4D"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default HeightAdjustIcon;
