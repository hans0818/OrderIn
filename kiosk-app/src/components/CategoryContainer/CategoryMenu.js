// src/components/CategoryContainer/CategoryMenu.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './CategoryMenu.module.css';
import CategoryMenuItem from './CategoryMenuItem';

function CategoryMenu({
  categoryRefs,
  isProgrammaticScroll,
  setIsProgrammaticScroll,
  menuContainerRef,
  categories,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const categoryItemRefs = useRef([]);
  const containerRef = useRef(null);
  const observer = useRef(null);

  const initializeObserver = useCallback(() => {
    if (observer.current) observer.current.disconnect();
  
    const observerOptions = {
      root: null,
      rootMargin: `90% 0px -90% 0px`, // 스크롤 시 정상 작동하는 설정 유지
      threshold: 0,
    };
  
    observer.current = new IntersectionObserver((entries) => {
      if (isProgrammaticScroll) return; // 프로그램적 스크롤 시 무시
  
      // 가시 영역에 들어온 요소들 중 가장 상단에 위치한 요소 찾기
      let minTop = Infinity;
      let minIndex = -1;
  
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = categoryRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
            const top = entry.boundingClientRect.top;
            if (top < minTop) {
              minTop = top;
              minIndex = index;
            }
          }
        }
      });
      
      if (minIndex !== -1) {
        setActiveIndex(minIndex);
      }
    }, observerOptions);
  
    categoryRefs.current.forEach((ref) => {
      if (ref) {
        observer.current.observe(ref);
      }
    });
  }, [categoryRefs, isProgrammaticScroll]); // 여기에서 categoryRefs 추가
  
  useEffect(() => {
    if (categories.length > 0 && categoryRefs.current.length === categories.length) {
      initializeObserver();
    }
  
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, [categories, categoryRefs, initializeObserver]); // 여기에서 categoryRefs 추가

  useEffect(() => {
    if (isProgrammaticScroll) return;

    if (categoryItemRefs.current.length !== categories.length) return;

    if (activeIndex < 0 || activeIndex >= categories.length) return;

    const ref = categoryItemRefs.current[activeIndex];
    const container = containerRef.current;
    if (ref && container) {
      const rect = ref.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset =
        rect.left - containerRect.left - containerRect.width / 2 + rect.width / 2;
      container.scrollTo({
        left: container.scrollLeft + offset,
        behavior: 'smooth',
      });
    }
  }, [activeIndex, categories, isProgrammaticScroll]);

  const handleCategoryClick = async (index) => {
    setIsProgrammaticScroll(true);
    setActiveIndex(index);

    const categoryElement = categoryRefs.current[index];
    const menuContainer = menuContainerRef.current;

    if (categoryElement && menuContainer) {
      const categoryRect = categoryElement.getBoundingClientRect();
      const menuContainerRect = menuContainer.getBoundingClientRect();

      const relativeOffsetTop = categoryRect.top - menuContainerRect.top;

      const targetScrollTop = menuContainer.scrollTop + relativeOffsetTop;

      const maxScrollTop = menuContainer.scrollHeight - menuContainer.clientHeight;
      const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

      menuContainer.scrollTo({
        top: finalScrollTop,
        behavior: 'smooth',
      });

      setTimeout(() => {
        setIsProgrammaticScroll(false);
      }, 500);
    } else {
      setIsProgrammaticScroll(false);
    }
  };

  return (
    <motion.div className={styles.categoryMenuContainer} ref={containerRef}>
      {categories.map((category, index) => (
        <CategoryMenuItem
          key={`${category.name}-${index}`}
          category={category}
          index={index}
          activeIndex={activeIndex}
          categoryItemRefs={categoryItemRefs}
          handleCategoryClick={handleCategoryClick}
        />
      ))}
    </motion.div>
  );
}

export default CategoryMenu;
