import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Terms.module.css';

function Terms() {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAllCheck = (e) => {
    const { checked } = e.target;
    setAgreements({
      terms: checked,
      privacy: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreements.terms && agreements.privacy) {
      navigate('/signup');
    } else {
      alert('모든 약관에 동의해주세요.');
    }
  };

  return (
    <div className={styles.termsContainer}>
      <div className={styles.termsBox}>
        <h2>회원가입 약관</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.allCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={agreements.terms && agreements.privacy}
                onChange={handleAllCheck}
              />
              전체 동의
            </label>
          </div>
          <div className={styles.termSection}>
            <label>
              <input
                type="checkbox"
                name="terms"
                checked={agreements.terms}
                onChange={handleCheckboxChange}
              />
              이용약관 동의 (필수)
            </label>
            <div className={styles.termContent}>
              <h3>OrderIn POS 시스템 이용약관</h3>
              <p>OrderIn POS 시스템(이하 "서비스")을 이용하기 위해서는 다음과 같은 이용약관에 동의하셔야 합니다.</p>
              
              <h4>서비스 제공 목적</h4>
              <p>본 서비스는 매장의 효율적인 주문 및 운영 관리를 위해 제공됩니다. 서비스 이용에 따른 책임과 권리는 본 약관에 따릅니다.</p>
              
              <h4>계정 및 보안</h4>
              <p>사용자는 본인의 계정 정보(아이디와 비밀번호)를 안전하게 관리해야 합니다. 타인에게 계정을 공유하거나 노출하여 발생한 손해에 대해서는 OrderIn이 책임을 지지 않습니다.</p>
              
              <h4>서비스 이용 제한</h4>
              <p>본 서비스는 정당한 목적 하에 제공되며, 허가되지 않은 접근이나 악의적 사용이 발견될 경우 사용자의 서비스 이용을 제한할 수 있습니다.</p>
              
              <h4>서비스 변경 및 중단</h4>
              <p>OrderIn은 서비스 운영상 필요에 따라 일부 기능을 변경하거나 중단할 수 있으며, 이러한 경우 사용자에게 사전 고지 후 서비스를 변경 또는 중단할 수 있습니다.</p>
              
              <h4>책임 제한</h4>
              <p>OrderIn은 서비스 이용 중 발생할 수 있는 데이터 손실, 중단 등 직접적이거나 간접적인 피해에 대해 법적 책임을 지지 않으며, 이는 사용자가 서비스를 책임 있게 이용함을 전제로 합니다.</p>
              
              <h4>약관 수정</h4>
              <p>본 약관은 서비스 운영에 따라 변경될 수 있으며, 변경된 내용은 서비스 공지사항을 통해 사전에 안내됩니다.</p>
            </div>
          </div>
          <div className={styles.termSection}>
            <label>
              <input
                type="checkbox"
                name="privacy"
                checked={agreements.privacy}
                onChange={handleCheckboxChange}
              />
              개인정보 수집 및 이용 동의 (필수)
            </label>
            <div className={styles.termContent}>
              <h3>OrderIn 개인정보 수집 및 이용 동의</h3>
              <p>OrderIn은 POS 시스템 서비스를 제공하기 위해 필요한 최소한의 개인정보를 수집 및 이용합니다. 개인정보 보호법 및 관련 법령에 따라, 사용자는 아래 내용을 충분히 읽고 동의 여부를 결정하실 수 있습니다.</p>
              
              <h4>수집하는 개인정보 항목</h4>
              <p>OrderIn은 서비스 이용 시 다음과 같은 개인정보를 수집합니다.</p>
              <ul>
                <li>필수 항목: 이름, 이메일 주소, 로그인 아이디, 비밀번호</li>
                <li>선택 항목: 연락처, 매장 주소, 기타 서비스 이용 관련 정보</li>
              </ul>
              
              <h4>개인정보 수집 및 이용 목적</h4>
              <ul>
                <li>서비스 제공 및 사용자 인증</li>
                <li>서비스 내 고객 지원 및 공지사항 전달</li>
                <li>POS 시스템 데이터 연동 및 고객 관리 기능 제공</li>
              </ul>
              
              <h4>개인정보 보유 및 이용 기간</h4>
              <p>OrderIn은 수집된 개인정보를 이용 목적이 달성된 후에는 법령에 따라 필요한 경우를 제외하고 즉시 파기합니다.</p>
              <ul>
                <li>회원 정보: 회원 탈퇴 시까지 보유</li>
                <li>법령에 따라 보존이 필요한 경우, 해당 법령에서 정한 기간 동안 보관</li>
              </ul>
              
              <h4>개인정보의 제3자 제공</h4>
              <p>OrderIn은 사용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 따라 요구되는 경우나 사용자 동의가 있는 경우에 한해 제한적으로 제공될 수 있습니다.</p>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={() => navigate('/login')}>
              취소
            </button>
            <button type="submit">
              다음
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Terms; 