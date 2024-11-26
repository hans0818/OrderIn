import React from 'react';

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"  // 기본 뷰포트 크기
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"  // 크기를 약간 줄여서 20x20으로 설정
    height="20"  // 크기를 약간 줄여서 20x20으로 설정
    style={{ transform: 'translateY(2px)' }}  // 아이콘을 아래로 내림
  >
    {/* 휴지통 아이콘 */}
    <path d="M3 6l3 12h12l3-12H3z" />  {/* 휴지통 본체 */}
    <path d="M8 6V4h8v2" />  {/* 휴지통 뚜껑 */}
    <line x1="10" y1="11" x2="10" y2="17" />  {/* 휴지통의 세로선 1 */}
    <line x1="14" y1="11" x2="14" y2="17" />  {/* 휴지통의 세로선 2 */}
  </svg>
);

export default TrashIcon;
