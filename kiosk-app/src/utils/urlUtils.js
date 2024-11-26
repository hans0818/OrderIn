// URL에서 파라미터를 읽어오는 함수
export const getKioskParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        userId: params.get('userId'),
        tableId: params.get('tableId'),
        tableName: params.get('tableName')
    };
};

// 키오스크 설정이 유효한지 확인하는 함수
export const validateKioskParams = (params) => {
    if (!params.userId || !params.tableId || !params.tableName) {
        throw new Error('유효하지 않은 키오스크 설정입니다.');
    }
    return true;
};

// 키오스크 URL이 유효한지 확인하는 함수
export const isValidKioskUrl = () => {
    try {
        const params = getKioskParams();
        return validateKioskParams(params);
    } catch (error) {
        console.error('키오스크 URL 검증 실패:', error);
        return false;
    }
}; 