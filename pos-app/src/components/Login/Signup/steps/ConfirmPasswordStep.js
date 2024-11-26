import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../../common/InputField/InputField';
import CompletedField from '../../../common/CompletedField/CompletedField';

const ConfirmPasswordStep = ({ formData, handleChange, errors, onEdit }) => {
  // 비밀번호 일치 여부 확인
  const passwordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  
  // 에러 메시지와 성공 메시지를 조건부로 설정
  const errorMessage = !passwordMatch && formData.confirmPassword !== '' 
    ? "비밀번호가 일치하지 않습니다" 
    : null;
  const successMessage = passwordMatch ? "비밀번호가 일치합니다" : null;

  return (
    <motion.div
      key="confirm-password-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <InputField
        label="비밀번호 확인"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="비밀번호를 다시 입력하세요"
        error={errorMessage}
        success={successMessage}
        autoFocus
      />
      <CompletedField
        label="비밀번호"
        value={formData.password}
        name="password"
        isPassword={true}
        onEdit={() => onEdit('password')}
      />
    </motion.div>
  );
};

export default ConfirmPasswordStep; 