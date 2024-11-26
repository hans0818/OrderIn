import React from 'react';

const ArrowDownIcon = ({ width = 30, height = 30 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#787878"  // CSS로 색상 조정 가능
    width={width}
    height={height}
  >
    {/* 아래로 향하는 화살표 모양 */}
    <path d="M12 16l-6-6h12l-6 6z" />
  </svg>
);

export default ArrowDownIcon;
