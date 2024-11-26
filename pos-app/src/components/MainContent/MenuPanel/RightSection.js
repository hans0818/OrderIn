// RightSection.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RightSection.module.css';

const RightSection = ({
  showMenuForm,
  menuNameInputRef,
  menuName,
  setMenuName,
  price,
  handlePriceChange,
  showFullForm,
  handleDelete,
  handleSave,
  basicOrderQuantity,
  handleQuantityChange,
  uploadedImage,
  handleImageUpload,
  handleImageRemove,
  menuDescription,
  setMenuDescription,
  menuSizes,
  menuTastes,
  selectedMenu,
  handleSizeAdd,
  handleTasteAdd,
  menuToppings,
  handleToppingAdd,
  handleKeyPress,
  handleCategoryEdit,
  handleMenuEdit,
  imageUrl,
}) => {
  // 메뉴 필수 정보 검증 함수 추가
  const isMenuValid = () => {
    return selectedMenu && 
           menuName && 
           menuName.trim() !== '' && 
           price && 
           Number(price) > 0;
  };

  return (
    <div className={styles.rightSection}>
      <AnimatePresence>
        {showMenuForm && (
          <motion.div>
            <div className={styles.menuActionContainer}>
              <div className={styles.editButtonGroup}>
                <button 
                  className={styles.editCategoryButton}
                  onClick={handleCategoryEdit}
                >
                  카테고리 편집
                </button>
                <button 
                  className={styles.editMenuButton}
                  onClick={handleMenuEdit}
                >
                  메뉴 편집
                </button>
              </div>
              <div className={styles.actionButtonGroup}>
                <button 
                  className={styles.deleteButton}
                  onClick={handleDelete}
                >
                  삭제
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                >
                  저장 [F10]
                </button>
              </div>
            </div>
            <div className={styles.menuDetailsContainer}>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>
                  메뉴 이름
                  <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  ref={menuNameInputRef}
                  type="text"
                  className={styles.menuNameInput}
                  placeholder="메뉴 이름"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>
                  가격
                  <span className={styles.requiredMark}>*</span>
                </label>
                <div className={styles.priceInputContainer}>
                  <input
                    type="text"
                    className={styles.priceInput}
                    placeholder="가격을 입력하세요."
                    value={price}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      handlePriceChange(numericValue);
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <span className={styles.currencyOverlay}>원</span>
                </div>
              </div>

              {showFullForm && (
                <>
                  <div className={styles.optionSelectContainer}>
                    <label className={styles.inputLabel}>옵션 추가</label>
                    <div className={styles.optionButtonContainer}>
                      <button 
                        className={`${styles.optionButton} ${
                          menuSizes[selectedMenu?.name]?.length > 0 ? styles.optionButtonActive : ''
                        }`} 
                        onClick={handleSizeAdd}
                        disabled={!isMenuValid()}
                      >
                        사이즈 추가
                      </button>
                      <button 
                        className={`${styles.optionButton} ${
                          menuTastes[selectedMenu?.name]?.length > 0 ? styles.optionButtonActive : ''
                        }`} 
                        onClick={handleTasteAdd}
                        disabled={!isMenuValid()}
                      >
                        맛 추가
                      </button>
                      <button 
                        className={`${styles.optionButton} ${
                          menuToppings[selectedMenu?.name]?.length > 0 ? styles.optionButtonActive : ''
                        }`}
                        onClick={handleToppingAdd}
                        disabled={!isMenuValid()}
                      >
                        토핑 추가
                      </button>
                    </div>
                    {!isMenuValid() && (
                      <p className={styles.optionWarning}>
                        메뉴 이름과 가격을 먼저 입력해주세요.
                      </p>
                    )}
                  </div>

                  <div className={styles.basicOrderQuantityContainer}>
                    <label className={styles.inputLabel}>기본 주문 수량</label>
                    <input
                      type="text"
                      className={styles.basicOrderQuantityInput}
                      placeholder="'3'이라고 적으시면 '기본 3인분' 주문 가능해요."
                      value={basicOrderQuantity}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        handleQuantityChange(numericValue);
                      }}
                    />
                    <span className={styles.quantityHint}>숫자만 입력하면 되요</span>
                  </div>

                  <div className={styles.imageUploadContainer}>
                    <div className={styles.imageUploadWrapper}>
                      <label 
                        className={`${styles.imageUploadButton} ${imageUrl ? styles.uploaded : ''}`}
                        htmlFor="imageUpload"
                      >
                        {imageUrl ? '사진 업로드 완료' : '사진 업로드'}
                      </label>
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      {imageUrl && (
                        <button 
                          className={styles.imageRemoveButton}
                          onClick={handleImageRemove}
                        >
                          사진 삭제
                        </button>
                      )}
                    </div>
                    
                    {imageUrl && (
                      <div className={styles.imagePreviewWrapper}>
                        <img 
                          src={imageUrl} 
                          alt="메뉴 이미지" 
                          className={styles.imagePreview}
                        />
                      </div>
                    )}
                  </div>

                  <div className={styles.descriptionContainer}>
                    <label className={styles.inputLabel}>메뉴 설명</label>
                    <textarea
                      className={styles.descriptionInput}
                      placeholder="메뉴에 대한 설명을 입력하세요."
                      value={menuDescription}
                      onChange={(e) => {
                        setMenuDescription(e.target.value);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightSection;
