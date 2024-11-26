import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; // 한국어 로케일
import { parseString } from 'xml2js';  // XML을 JSON으로 변환
import styles from './Calendar.module.css'; // CSS 모듈을 사용한 스타일링

function Calendar({ selectedDate, setSelectedDate, calendarPosition }) {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    // 공공데이터 API 서비스키
    const serviceKey = 'GcI%2B4aygf77uc9e0la8Y%2B4tQUn8aL89r1F2dGSd2Y5DEch%2FizromYXT%2B0jRqoyE99YejfhYRacmfFMpI5K0wAQ%3D%3D';
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
    const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?ServiceKey=${serviceKey}&solYear=${year}&solMonth=${month}`;

    // 공휴일 데이터 API 호출
    fetch(url)
      .then(response => response.text())
      .then(data => {
        // XML을 JSON으로 변환
        parseString(data, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err);
            return;
          }
          console.log('파싱된 JSON 데이터:', result); // 응답 데이터 확인
          
          // items 배열을 확인하고, 존재하면 locdate를 저장
          const items = result?.response?.body?.[0]?.items?.[0]?.item;
          if (items && Array.isArray(items)) {
            const holidayDates = items.map(item => item.locdate[0]); // 공휴일 날짜 목록
            setHolidays(holidayDates);  // 공휴일 저장
          } else {
            console.log('공휴일 데이터가 없습니다.');
          }
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // 날짜가 공휴일인지 확인하는 함수
  const isHoliday = (date) => {
    const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    return holidays.includes(formattedDate);
  };

  return (
    <div
      className={styles.calendarContainer}
      style={{ top: `${calendarPosition.y}px`, left: `${calendarPosition.x}px` }}
    >
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
        locale={ko} // 한국어 로케일 설정
        dayClassName={(date) => (isHoliday(date) ? styles.holiday : '')} // 공휴일이면 스타일 추가
      />
    </div>
  );
}

export default Calendar;
