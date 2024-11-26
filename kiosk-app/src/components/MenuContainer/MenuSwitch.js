// src/components/MenuContainer/MenuSwitch.js
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import styles from './MenuSwitch.module.css';

const MenuSwitch = React.forwardRef(({
  menuId,
  menuName,
  menuPrice,
  isChecked = false,
  onSwitchChange,
  isDefault = false,
  isDisabled = false,
  description,
  imageUrl,
}, ref) => {
  const offsetX = useMotionValue(0);
  const [maxOffsetX, setMaxOffsetX] = useState(1);
  const trackElementRef = useRef(null);
  const handleElementRef = useRef(null);

  // 메뉴 확장 상태를 관리하는 상태 추가
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateConstraints = () => {
      const trackElement = trackElementRef.current;
      const handleElement = handleElementRef.current;

      if (trackElement && handleElement) {
        const trackRect = trackElement.getBoundingClientRect();
        const handleWidth = handleElement.offsetWidth;
        const newMaxOffsetX = trackRect.width - handleWidth;
        setMaxOffsetX(newMaxOffsetX);
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);

    return () => {
      window.removeEventListener('resize', updateConstraints);
    };
  }, []);

  useEffect(() => {
    const newOffsetX = isChecked && !isDisabled ? maxOffsetX : 0;
    offsetX.stop();
    animate(offsetX, newOffsetX, {
      duration: 0.3,
      ease: 'easeOut',
    });
  }, [isChecked, isDisabled, maxOffsetX, offsetX]);

  const trackColor = useTransform(
    offsetX,
    [0, maxOffsetX],
    ['rgb(235, 235, 235)', 'rgb(255, 69, 0)']
  );

  const handlePanStart = (event, info) => {
    event.preventDefault();
  };

  const handlePan = (event, info) => {
    const newOffsetX = Math.min(Math.max(offsetX.get() + info.delta.x, 0), maxOffsetX);
    offsetX.set(newOffsetX);
  };

  const handlePanEnd = () => {
    if (isDisabled) return;

    const currentOffsetX = offsetX.get();
    const isEndReached = currentOffsetX >= maxOffsetX / 2;

    const newOffsetX = isEndReached ? maxOffsetX : 0;

    offsetX.stop();
    animate(offsetX, newOffsetX, {
      duration: 0.3,
      ease: 'easeOut',
    });

    onSwitchChange(menuId, menuName, menuPrice, isEndReached);
  };

  // 메뉴 스위치 클릭 시 확장 상태 토글
  const handleToggleExpand = () => {
    if (description || imageUrl) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div ref={ref} className={styles.menuSwitch}>
      <motion.div
        className={styles.menuTrack}
        style={{ backgroundColor: trackColor }}
        ref={trackElementRef}
        onClick={handleToggleExpand} // 클릭 시 확장/축소 토글
      >
        <motion.div
          className={styles.menuHandle}
          ref={handleElementRef}
          style={{ x: offsetX }}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          <div className={styles.menuName}>
            <span 
              className={`${styles.menuNameText} ${
                (description || imageUrl) ? styles.highlighted : ''
              }`}
            >
              {menuName}
            </span>
          </div>
        </motion.div>
        <div className={styles.menuPrice}>
          <span>{menuPrice}원</span>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.menuDetails}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {imageUrl && (
              <img src={imageUrl} alt={menuName} className={styles.menuImage} />
            )}
            {description && (
              <p className={styles.menuDescription}>{description}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <input
        type="checkbox"
        checked={!!(isChecked && isDefault)}
        onChange={() => {}}
        className={styles.hiddenCheckbox}
      />
    </div>
  );
});

export default MenuSwitch;
