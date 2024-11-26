import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../../common/InputField/InputField';

const NameStep = ({ formData, handleChange, errors }) => {
  return (
    <motion.div
      key="name-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <InputField
        label="이름"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="이름을 입력하세요"
        error={errors.name}
        autoFocus
      />
    </motion.div>
  );
};

export default NameStep; 