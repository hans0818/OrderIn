import React from 'react';

const AddIcon = ({ width = 16, height = 16, strokeWidth = 3 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: 'translateY(2px)' }}
  >
    <path
      d="M8 4C8.276 4 8.5 4.224 8.5 4.5V7.5H11.5C11.776 7.5 12 7.724 12 8C12 8.276 11.776 8.5 11.5 8.5H8.5V11.5C8.5 11.776 8.276 12 8 12C7.724 12 7.5 11.776 7.5 11.5V8.5H4.5C4.224 8.5 4 8.276 4 8C4 7.724 4.224 7.5 4.5 7.5H7.5V4.5C7.5 4.224 7.724 4 8 4Z"
      fill="black"
      stroke="black"
      strokeWidth={strokeWidth}  // 선 굵기 조절
    />
  </svg>
);

export default AddIcon;