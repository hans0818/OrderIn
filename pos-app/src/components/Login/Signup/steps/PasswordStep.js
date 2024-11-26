import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../../common/InputField/InputField';
import CompletedField from '../../../common/CompletedField/CompletedField';

const PasswordStep = ({ formData, handleChange, errors, onEdit }) => {
  return (
    <motion.div
      key="password-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <InputField
        label="비밀번호"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="비밀번호를 입력하세요"
        error={errors.password}
        hint="8자 이상의 영문, 숫자, 특수문자 조합"
        autoFocus
      />
      <CompletedField
        label="아이디"
        value={formData.username}
        name="username"
        onEdit={() => onEdit('username')}
      />
      <CompletedField
        label="이메일"
        value={formData.email}
        name="email"
        onEdit={() => onEdit('email')}
      />
      <CompletedField
        label="휴대폰 번호"
        value={formData.phone}
        name="phone"
        onEdit={() => onEdit('phone')}
      />
      <CompletedField
        label="주민번호"
        value={`${formData.ssn}-${formData.ssnGender}`}
        name="ssn"
        isSSN={true}
        onEdit={() => onEdit('ssn')}
      />
      <CompletedField
        label="이름"
        value={formData.name}
        name="name"
        onEdit={() => onEdit('name')}
      />
    </motion.div>
  );
};

export default PasswordStep; 