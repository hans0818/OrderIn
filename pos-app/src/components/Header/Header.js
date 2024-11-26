// Header.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from './Calendar';
import styles from './Header.module.css';
import { SpaceEdit, TableEdit, MenuEdit } from './PosFunction/PosFunctionEdit';
import Sidebar from '../Sidebar/Sidebar';
import { KioskCreate } from './PosFunction/KioskCreate';

function Header({ resetSpaceEditing, isEditingSpace, isTableEditing, isMenuEditing, onEditSection, onMenuEdit, onTableEdit, tables, onOpenKioskModal }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({ x: 0, y: 0 });
  const [storeName, setStoreName] = useState('가게이름');
  const calendarRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreName = async () => {
      const user = auth.currentUser;
      if (user) {
        const storesRef = collection(db, 'users', user.uid, 'stores');
        const storeSnapshot = await getDocs(storesRef);
        if (!storeSnapshot.empty) {
          const firstStore = storeSnapshot.docs[0].data();
          setStoreName(firstStore.storeName || '가게이름');
        }
      }
    };

    fetchStoreName();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayName = days[date.getDay()];

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${year}.${month}.${day}(${dayName}) ${ampm} ${hours}:${minutes}`;
  };

  const handleDateClick = (e) => {
    setShowCalendar(!showCalendar);
    setCalendarPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);

  const handleTableHomeClick = async () => {
    if (isEditingSpace || isTableEditing || isMenuEditing) {
      try {
        if (isTableEditing) {
          console.log('테이블 변경사항 저장 시작');
          await resetSpaceEditing();
          console.log('테이블 변경사항 저장 완료');
        } else {
          await resetSpaceEditing();
        }
      } catch (error) {
        console.error('편집 모드 종료 실패:', error);
      }
    }
  };

  const handleIconClick = (e) => {
    setShowDropdown(!showDropdown);
    setDropdownPosition({ x: e.clientX, y: e.clientY });
  };

  const handleOverlayClick = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleLogout = () => {
    navigate('/login');
  };



  // 편집 모드 상태에 따라 버튼 텍스트 변경
  const buttonText = '테이블 홈';

  return (
    <header className={styles.header}>
      <h1 onClick={handleTableHomeClick}>{buttonText}</h1>
      {!isEditingSpace && (
        <>
          <svg
            width="45"
            height="26"
            viewBox="0 0 45 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.navMenuIcon}
            onClick={handleIconClick}
          >
            <path d="M8 7H37" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 12H37" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 17H37" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <AnimatePresence>
            {showDropdown && (
              <>
                <motion.div
                  className={styles.dropdownContainer}
                  style={{ top: `${dropdownPosition.y}px`, left: `${dropdownPosition.x}px` }}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <p className={styles.storeName}>{storeName}</p>
                  <hr className={styles.divider} />
                  <p className={styles.posInfo}>포스 기능 알아보기</p>
                  <hr className={styles.divider} />
                  <div className={styles.horizontalMenu}>
                    <span className={styles.functionButton}>매출 리포트</span>
                    <span className={styles.functionButton}>시재 관리</span>
                  </div>
                  <div className={styles.horizontalMenu}>
                    <span className={styles.functionButton}>재고 관리</span>
                    <span className={styles.functionButton}>직원 관리</span>
                  </div>
                  <hr className={styles.divider} />
                  <div className={styles.horizontalMenu}>
                    <SpaceEdit 
                      onEditSection={onEditSection}
                      isEditingSpace={isEditingSpace}
                      isTableEditing={isTableEditing}
                      isMenuEditing={isMenuEditing}
                      setShowDropdown={handleOverlayClick}
                    />
                    <TableEdit
                      onTableEdit={onTableEdit}
                      isEditingSpace={isEditingSpace}
                      isTableEditing={isTableEditing}
                      isMenuEditing={isMenuEditing}
                      setShowDropdown={handleOverlayClick}
                    />
                  </div>
                  <div className={styles.horizontalMenu}>
                    <MenuEdit
                      onMenuEdit={onMenuEdit}
                      isEditingSpace={isEditingSpace}
                      isTableEditing={isTableEditing}
                      isMenuEditing={isMenuEditing}
                      setShowDropdown={handleOverlayClick}
                    />
                    <KioskCreate 
                      tables={tables}
                      setShowDropdown={handleOverlayClick}
                      onOpenKioskModal={onOpenKioskModal}
                    />
                  </div>
                  <hr className={styles.divider} />
                  <div className={styles.horizontalMenu}>
                    <span className={styles.functionButton}>공지사항</span>
                    <span className={styles.functionButton}>문의하기</span>
                  </div>
                  <div className={styles.horizontalMenuBottom}>
                    <span className={styles.functionButton}>설정</span>
                    <span className={styles.functionButton} onClick={handleLogout}>로그아웃</span>
                  </div>
                </motion.div>
                <motion.div
                  className={styles.overlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleOverlayClick}
                />
              </>
            )}
          </AnimatePresence>

          <span className={styles.dateTime} onClick={handleDateClick}>
            {formatDate(currentDate)}
          </span>

          {showCalendar && (
            <div ref={calendarRef}>
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarPosition={calendarPosition}
              />
            </div>
          )}
          <Sidebar />
        </>
      )}
    </header>
  );
}

export default Header;
