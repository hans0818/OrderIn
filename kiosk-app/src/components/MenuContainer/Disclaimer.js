import React from 'react';
import styles from './Disclaimer.module.css';  // Disclaimer 전용 CSS 모듈 불러오기

function Disclaimer() {
  return (
    <div className={styles.disclaimerContainer}>
      <h3 className={styles.disclaimerTitle}>유의 사항</h3>
      <p className={styles.disclaimerItem}>• 메뉴 사진은 연출된 이미지로 실제 조리된 음식과 다를 수 있습니다.</p>
      <p className={styles.disclaimerItem}>• 모든 음식에는 알레르기 유발 성분이 포함될 수 있습니다. 유의하시기 바랍니다.</p>
      <p className={styles.disclaimerItem}>• 조리 시간은 주문량과 매장 상황에 따라 달라질 수 있습니다. 양해 부탁드립니다.</p>
      <p className={styles.disclaimerItem}>• (주)OrderIN은 통신판매중개자로 거래 당사자가 아니므로, 판매자가 등록한 상품정보 및 거래 등에 대해 책임지지 않습니다. 단, (주)OrderIN이 판매자로 등록하여 판매한 상품은 판매자로서 책임을 부담합니다.</p>
    </div>
  );
}

export default Disclaimer;
