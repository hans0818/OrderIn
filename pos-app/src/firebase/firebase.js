import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDl6_-1CSxgu3-Ivf-Kzi909KXKGyXTZb4",
    authDomain: "orderin-22836.firebaseapp.com",
    projectId: "orderin-22836",
    storageBucket: "orderin-22836.appspot.com",
    messagingSenderId: "1022058391676",
    appId: "1:1022058391676:web:d5a6c547ca795478e641f9",
    measurementId: "G-D7G9ZV5DLK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 개발 환경에서 reCAPTCHA 건너뛰기
auth.settings.appVerificationDisabledForTesting = true;

export { auth, db, storage }; 