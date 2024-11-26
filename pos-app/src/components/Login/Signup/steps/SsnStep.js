import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../../common/InputField/InputField';
import CompletedField from '../../../common/CompletedField/CompletedField';

const SsnStep = ({ formData, handleSsnChange, errors }) => {
  return (
    <motion.div
      key="ssn-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <InputField
        label="주민등록번호 7자리"
        isSSN={true}
        ssnValues={{
          ssn: formData.ssn,
          ssnGender: formData.ssnGender
        }}
        onSsnChange={handleSsnChange}
        error={errors.ssn}
        placeholder="______-_******"
        autoFocus
      />
      <CompletedField
        label="이름"
        value={formData.name}
        name="name"
      />
    </motion.div>
  );
};

export default SsnStep; 