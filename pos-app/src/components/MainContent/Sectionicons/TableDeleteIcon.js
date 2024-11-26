import React from 'react';

const TableDeleteIcon = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E74800"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={width}
    height={height}
    style={{ transform: 'translateY(2px)' }}
  >
    <path d="M3 6l3 12h12l3-12H3z" />
    <path d="M8 6V4h8v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default TableDeleteIcon;