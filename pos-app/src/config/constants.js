export const KIOSK_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com'  // 프로덕션 도메인
    : window.location.hostname === 'localhost'
        ? 'http://localhost:3001'  // 3000 -> 3001
        : `http://${window.location.hostname}:3001`;  // 3000 -> 3001

export const POS_CONFIG = {
    STORE_NAME: "베타버젼테스트"  // 실제 사용중인 스토어 이름으로 설정
};

export const updatePosConfig = (newConfig) => {
    Object.assign(POS_CONFIG, newConfig);
};