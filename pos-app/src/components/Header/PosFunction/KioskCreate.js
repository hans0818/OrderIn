import React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebase';
import styles from '../Header.module.css';

export const KioskCreate = ({ setShowDropdown, onOpenKioskModal }) => {
    const handleKioskCreate = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const storesRef = collection(db, `users/${user.uid}/stores`);
            const storesSnapshot = await getDocs(storesRef);
            if (storesSnapshot.empty) return;

            const storeDoc = storesSnapshot.docs[0];
            const storeName = storeDoc.id;

            const sectionsRef = collection(db, `users/${user.uid}/stores/${storeName}/sections`);
            const sectionsSnapshot = await getDocs(sectionsRef);

            let allTables = [];
            for (const sectionDoc of sectionsSnapshot.docs) {
                const tablesRef = collection(db, `users/${user.uid}/stores/${storeName}/sections/${sectionDoc.id}/tables`);
                const tablesSnapshot = await getDocs(tablesRef);
                
                const sectionTables = tablesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    text: doc.data().text
                }));
                
                allTables = [...allTables, ...sectionTables];
            }

            setShowDropdown(false);
            onOpenKioskModal(allTables);
        } catch (error) {
            console.error('테이블 정보 가져오기 실패:', error);
        }
    };

    return (
        <span 
            className={styles.functionButton}
            onClick={handleKioskCreate}
        >
            키오스크 제작
        </span>
    );
}; 