import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../../common/InputField/InputField';
import CompletedField from '../../../common/CompletedField/CompletedField';

const EmailStep = ({ formData, handleChange, handlePhoneChange, handleSsnChange, errors }) => {
  return (
    <motion.div
      key="email-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <InputField
        label="이메일"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="이메일을 입력하세요"
        error={errors.email}
        autoFocus
      />

      <CompletedField
        label="휴대폰 번호"
        value={formData.phone}
        name="phone"
        type="tel"
        onChange={handlePhoneChange}
        placeholder="휴대폰 번호를 입력하세요"
      />

      <CompletedField
        label="주민번호"
        isSSN={true}
        ssnValues={{
          ssn: formData.ssn,
          ssnGender: formData.ssnGender
        }}
        onSsnChange={handleSsnChange}
      />

      <CompletedField
        label="이름"
        value={formData.name}
        name="name"
        onChange={handleChange}
        placeholder="이름을 입력하세요"
      />
    </motion.div>
  );
};

export default EmailStep; 