import React, { useEffect } from 'react';
import { db, auth } from '../../../firebase/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { POS_CONFIG } from '../../../config/constants';
import styles from './PaymentScreen.module.css';

export default function PaymentScreen({ onClose, tableId }) {
  // 테이블 홈 버튼 클릭 감지
  useEffect(() => {
    const handleTableHomeClick = (e) => {
      if (e.target.tagName.toLowerCase() === 'h1') {  // 테이블 홈 버튼 클릭 시
        onClose();  // PaymentScreen 닫기
      }
    };

    document.addEventListener('click', handleTableHomeClick);

    return () => {
      document.removeEventListener('click', handleTableHomeClick);
    };
  }, [onClose]);

  const handlePayment = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // 해당 테이블의 pending 상태인 주문들을 찾습니다
      const ordersRef = collection(db, `users/${user.uid}/stores/${POS_CONFIG.STORE_NAME}/orders`);
      const pendingOrdersQuery = query(ordersRef, where('tableId', '==', tableId), where('status', '==', 'pending'));
      const snapshot = await getDocs(pendingOrdersQuery);

      if (snapshot.empty) {
        console.log('처리할 주문이 없습니다.');
        return;
      }

      console.log('결제 처리할 주문:', snapshot.docs.length, '건');

      // 모든 주문의 상태를 completed로 업데이트합니다
      for (const orderDoc of snapshot.docs) {
        const orderRef = doc(ordersRef, orderDoc.id);
        console.log('주문 상태 업데이트:', orderDoc.id);
        
        await updateDoc(orderRef, {
          status: 'completed',
          completedAt: new Date().toISOString()
        });
      }

      console.log('모든 주문 처리 완료');
      alert('결제가 완료되었습니다.');
      onClose();
      
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.paymentScreenOverlay}>
      <div className={styles.paymentScreen}>
        <button 
          className={styles.paymentButton}
          onClick={handlePayment}
        >
          결제완료
        </button>
      </div>
    </div>
  );
} 