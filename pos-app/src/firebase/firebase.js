import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// 환경 변수 로드 확인
console.log('Firebase Config:', {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '존재함' : '없음',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '존재함' : '없음',
    // ... 다른 설정들도 확인
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 개발 환경에서 reCAPTCHA 건너뛰기
auth.settings.appVerificationDisabledForTesting = true;

export { auth, db, storage }; 