import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Signup.module.css';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

// 단계별 컴포넌트 import
import NameStep from './steps/NameStep';
import SsnStep from './steps/SsnStep';
import PhoneStep from './steps/PhoneStep';
import EmailStep from './steps/EmailStep';
import UsernameStep from './steps/UsernameStep';
import PasswordStep from './steps/PasswordStep';
import ConfirmPasswordStep from './steps/ConfirmPasswordStep';
import PhoneVerification from './PhoneVerification';

function Signup() {
  const [step, setStep] = useState('name');
  const [formData, setFormData] = useState({
    name: '',
    ssn: '',
    ssnGender: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    verificationMethod: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'username' && value.length >= 8) {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, 'users'),
            where('username', '==', value.toLowerCase())
          )
        );
        
        if (!querySnapshot.empty) {
          setErrors(prev => ({
            ...prev,
            username: '이미 사용 중인 아이디입니다'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            username: ''
          }));
        }
      } catch (error) {
        console.error('아이디 중복 검사 중 오류:', error);
      }
    }
    
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: { type: 'error', message: '비밀번호가 일치하지 않습니다' }
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: { type: 'success', message: '비밀번호가 일치합니다' }
        }));
      }
    } else if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSsnChange = (e) => {
    const { name, value } = e.target;
    const onlyNums = value.replace(/[^0-9]/g, '');
    
    if (name === 'ssnFirst') {
      if (onlyNums.length <= 6) {
        setFormData(prev => ({
          ...prev,
          ssn: onlyNums
        }));
        if (onlyNums.length === 6) {
          if (!validateBirthDate(onlyNums)) {
            setErrors({ ssn: '주민번호가 맞지 않습니다' });
            return;
          } else {
            setErrors({});
          }
        }
      }
    } else if (name === 'ssnLast') {
      if (onlyNums.length <= 1) {
        if (!validateBirthDate(formData.ssn)) {
          setErrors({ ssn: '주민번호가 맞지 않습니다' });
          return;
        }
        
        if (/^[1-4]$/.test(onlyNums)) {
          setErrors({});
          setFormData(prev => ({
            ...prev,
            ssnGender: onlyNums
          }));
          if (onlyNums.length === 1 && validateBirthDate(formData.ssn)) {
            setStep('phone');
          }
        } else if (onlyNums.length === 1) {
          setErrors({ ssn: '주민번호가 맞지 않습니다' });
          setFormData(prev => ({
            ...prev,
            ssnGender: ''
          }));
        }
      }
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const onlyNums = value.replace(/[^0-9]/g, '');
    
    if (onlyNums.length <= 11) {
      let formattedPhone = onlyNums;
      if (onlyNums.length > 3) {
        formattedPhone = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
      }
      if (onlyNums.length > 7) {
        formattedPhone = formattedPhone.slice(0, 8) + '-' + formattedPhone.slice(8);
      }
      setFormData(prev => ({
        ...prev,
        phone: formattedPhone
      }));
    }
  };

  const validateName = () => {
    if (!formData.name) {
      setErrors({ name: '이름을 입력해주세요' });
      return false;
    } else if (formData.name.length < 2) {
      setErrors({ name: '이름은 2자 이상이어야 합니다' });
      return false;
    }
    return true;
  };

  const validateUsername = async () => {
    if (!formData.username) {
      setErrors({ username: '아이디를 입력해주세요' });
      return false;
    } else if (formData.username.length < 8) {
      setErrors({ username: '아이디는 8자 이상이어야 합니다' });
      return false;
    }

    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'users'),
          where('username', '==', formData.username.toLowerCase())
        )
      );
      
      if (!querySnapshot.empty) {
        setErrors({ username: '이미 사용 중인 아이디입니다' });
        return false;
      }
      return true;
    } catch (error) {
      console.error('아이디 중복 검사 중 오류:', error);
      setErrors({ username: '중복 검사 중 오류가 발생했습니다' });
      return false;
    }
  };

  const validatePassword = () => {
    if (!formData.password) {
      setErrors({ password: '비밀번호를 입력해주세요' });
      return false;
    } else if (formData.password.length < 8) {
      setErrors({ password: '비밀번호는 8자 이상이어야 합니다' });
      return false;
    }
    return true;
  };

  const validatePhone = () => {
    const phoneRegex = /^01[0-9]-[0-9]{4}-[0-9]{4}$/;
    if (!formData.phone) {
      setErrors({ phone: '휴대폰 번호를 입력해주세요' });
      return false;
    } else if (!phoneRegex.test(formData.phone)) {
      setErrors({ phone: '올바른 휴대폰 번호 형식이 아닙니다' });
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setErrors({ email: '이메일을 입력해주세요' });
      return false;
    } else if (!emailRegex.test(formData.email)) {
      setErrors({ email: '올바른 이메일 형식이 아닙니다' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 'name' && validateName()) {
      setStep('ssn');
    } else if (step === 'phone' && validatePhone()) {
      setStep('email');
    } else if (step === 'email' && validateEmail()) {
      setStep('username');
    } else if (step === 'username') {
      const isValid = await validateUsername();
      if (isValid) {
        setStep('password');
      }
    } else if (step === 'password' && validatePassword()) {
      setStep('confirmPassword');
    } else if (step === 'confirmPassword' && formData.password === formData.confirmPassword) {
      setStep('verification');
    }
  };

  const validateBirthDate = (birthDate) => {
    if (!birthDate || birthDate.length !== 6) return false;

    const year = parseInt(birthDate.substring(0, 2));
    const month = parseInt(birthDate.substring(2, 4));
    const day = parseInt(birthDate.substring(4, 6));

    if (year < 0 || year > 99) {
      setErrors({ ssn: '주민번호가 맞지 않습니다' });
      return false;
    }

    if (month < 1 || month > 12) {
      setErrors({ ssn: '주민번호가 맞지 않습니다' });
      return false;
    }

    const lastDayOfMonth = new Date(2000, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) {
      setErrors({ ssn: '주민번호가 맞지 않습니다' });
      return false;
    }

    return true;
  };

  const handleVerificationMethodSelect = (method) => {
    setFormData(prev => ({
      ...prev,
      verificationMethod: method
    }));
    setStep(method === 'phone' ? 'phoneVerification' : 'emailVerification');
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputsContainer}>
            <AnimatePresence mode="wait">
              {step === 'name' && (
                <NameStep
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              )}

              {step === 'ssn' && (
                <SsnStep
                  formData={formData}
                  handleSsnChange={handleSsnChange}
                  errors={errors}
                />
              )}

              {step === 'phone' && (
                <PhoneStep
                  formData={formData}
                  handlePhoneChange={handlePhoneChange}
                  handleChange={handleChange}
                  handleSsnChange={handleSsnChange}
                  errors={errors}
                />
              )}

              {step === 'email' && (
                <EmailStep
                  formData={formData}
                  handleChange={handleChange}
                  handlePhoneChange={handlePhoneChange}
                  handleSsnChange={handleSsnChange}
                  errors={errors}
                />
              )}

              {step === 'username' && (
                <UsernameStep
                  formData={formData}
                  handleChange={handleChange}
                  handlePhoneChange={handlePhoneChange}
                  handleSsnChange={handleSsnChange}
                  errors={errors}
                />
              )}

              {step === 'password' && (
                <PasswordStep
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                  onEdit={setStep}
                />
              )}

              {step === 'confirmPassword' && (
                <ConfirmPasswordStep
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                  onEdit={setStep}
                />
              )}

              {step === 'verification' && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.verificationContainer}
                >
                  <h3>인증 방법 선택</h3>
                  <div className={styles.verificationOptions}>
                    <button
                      type="button"
                      className={styles.verificationOption}
                      onClick={() => handleVerificationMethodSelect('phone')}
                    >
                      <span className={styles.verificationIcon}>📱</span>
                      <div className={styles.verificationText}>
                        <h4>휴대폰 인증</h4>
                        <p>휴대폰으로 인증번호를 받아 인증합니다</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={styles.verificationOption}
                      onClick={() => handleVerificationMethodSelect('email')}
                    >
                      <span className={styles.verificationIcon}>✉️</span>
                      <div className={styles.verificationText}>
                        <h4>이메일 인증</h4>
                        <p>이메일로 인증번호를 받아 인증합니다</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'phoneVerification' && (
                <motion.div
                  key="phone-verification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PhoneVerification
                    phone={formData.phone}
                    userData={formData}
                    onVerificationComplete={() => {
                      console.log('전달되는 formData:', formData);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
