import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../../common/InputField/InputField';
import CompletedField from '../../../common/CompletedField/CompletedField';

const PhoneStep = ({ formData, handlePhoneChange, handleChange, handleSsnChange, errors }) => {
  return (
    <motion.div
      key="phone-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <InputField
        label="휴대폰 번호"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handlePhoneChange}
        placeholder="휴대폰 번호를 입력하세요"
        error={errors.phone}
        hint="'-' 없이 숫자만 입력해주세요"
        maxLength={13}
        autoFocus
      />
      
      <CompletedField
        label="주민번호"
        isSSN={true}
        ssnValues={{
          ssn: formData.ssn,
          ssnGender: formData.ssnGender
        }}
        onSsnChange={handleSsnChange}
        value={`${formData.ssn}-${formData.ssnGender}`}
        onChange={handleSsnChange}
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

export default PhoneStep; 