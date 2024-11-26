import React, { useState } from 'react';
import { auth } from '../../../firebase/firebase';
import styles from './KioskModal.module.css';
import { KIOSK_URL, POS_CONFIG } from '../../../config/constants';

export default function KioskModal({ isOpen, onClose, tables }) {
    const [generatedUrls, setGeneratedUrls] = useState({});

    if (!isOpen) return null;

    const handleCreateKiosk = (table) => {
        const user = auth.currentUser;
        if (!user) return;

        const params = new URLSearchParams({
            userId: user.uid,
            tableId: table.id,
            tableName: table.text,
            storeName: POS_CONFIG.STORE_NAME
        });

        const kioskUrl = `${KIOSK_URL}/kiosk?${params.toString()}`;
        
        setGeneratedUrls(prev => ({
            ...prev,
            [table.id]: kioskUrl
        }));
    };

    const handleCopyUrl = async (url) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                alert('URL이 복사되었습니다.');
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    alert('URL이 복사되었습니다.');
                } catch (err) {
                    console.error('복사 실패:', err);
                    alert('URL 복사에 실패했습니다. 수동으로 복사해주세요.');
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (err) {
            console.error('복사 실패:', err);
            alert('URL 복사에 실패했습니다. 수동으로 복사해주세요.');
        }
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>키오스크 제작</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalContent}>
                    <h3>테이블 목록</h3>
                    <div className={styles.tableList}>
                        {tables && tables.map((table) => (
                            <div key={table.id} className={styles.tableItem}>
                                <div className={styles.tableInfo}>
                                    <span>{table.text}</span>
                                    <button 
                                        className={styles.createButton}
                                        onClick={() => handleCreateKiosk(table)}
                                    >
                                        키오스크 생성
                                    </button>
                                </div>
                                {generatedUrls[table.id] && (
                                    <div className={styles.urlContainer}>
                                        <input 
                                            type="text" 
                                            value={generatedUrls[table.id]} 
                                            readOnly 
                                            className={styles.urlInput}
                                        />
                                        <button
                                            className={styles.copyButton}
                                            onClick={() => handleCopyUrl(generatedUrls[table.id])}
                                        >
                                            복사
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
} 