// src/App.js
import React, { useRef, useState, useCallback } from 'react';
import styles from './App.module.css';
import CategoryMenu from './components/CategoryContainer/CategoryMenu';
import CategorySwitch from './components/CategoryContainer/CategorySwitch';
import MenuManager from './components/MenuContainer/MenuManager';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const categoryRefs = useRef([]);
  const menuContainerRef = useRef(null);
  const [isBeverage, setIsBeverage] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const handleToggle = () => {
    setIsBeverage((prevState) => !prevState);
  };

  const handleOrderComplete = useCallback(() => {
    console.log('App - 주문 완료: orders 초기화');
    setOrders([]);
  }, []);

  return (
    <Router>
      <section className={styles.categoryContainer}>
        <CategoryMenu
          categoryRefs={categoryRefs}
          isProgrammaticScroll={isProgrammaticScroll}
          setIsProgrammaticScroll={setIsProgrammaticScroll}
          menuContainerRef={menuContainerRef}
          categories={categories}
        />
        <CategorySwitch isBeverage={isBeverage} handleToggle={handleToggle} />
      </section>

      <section className={styles.menuSwitchContainer}>
        <MenuManager
          categoryRefs={categoryRefs}
          isBeverage={isBeverage}
          setIsProgrammaticScroll={setIsProgrammaticScroll}
          menuContainerRef={menuContainerRef}
          setCategories={setCategories}
          orders={orders}
          setOrders={setOrders}
          onOrderComplete={handleOrderComplete}
        />
      </section>
    </Router>
  );
}

export default App;
