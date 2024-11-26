// src/hooks/menu/useMenuScroll.js
import { useRef, useCallback } from 'react';

function useMenuScroll(menuContainerRef, orderContainerHeight, setIsProgrammaticScroll) {
  const menuRefs = useRef({});
  const isScrolling = useRef(false);
  const SCROLL_DURATION = 500;

  const handleScrollToMenuItem = useCallback(
    (menuId, onComplete) => {
      if (isScrolling.current || !menuId) return;

      const menuSwitchElement = menuRefs.current[menuId];
      const menuContainerElement = menuContainerRef.current;

      if (!menuSwitchElement || !menuContainerElement) return;

      setIsProgrammaticScroll(true);
      isScrolling.current = true;

      const windowHeight = window.innerHeight;
      const offsetTop = menuSwitchElement.offsetTop;

      let scrollTop;

      if (orderContainerHeight === 71) {
        scrollTop = offsetTop;
      } else {
        const orderContainerPixelHeight = (orderContainerHeight / 100) * windowHeight;
        const visibleHeight = windowHeight - orderContainerPixelHeight;
        scrollTop = offsetTop - (visibleHeight / 2);
      }

      menuContainerElement.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

      setTimeout(() => {
        setIsProgrammaticScroll(false);
        isScrolling.current = false;
        if (onComplete) onComplete();
      }, SCROLL_DURATION);
    },
    [orderContainerHeight, setIsProgrammaticScroll, menuContainerRef]
  );

  return { menuRefs, handleScrollToMenuItem, SCROLL_DURATION };
}

export default useMenuScroll;