import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // 로딩 중일 때 표시할 내용
    return <div>로딩 중...</div>;
  }

  if (!user) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    return <Navigate to="/login" />;
  }

  // 인증된 사용자는 요청한 페이지로 이동
  return children;
}

export default PrivateRoute; 