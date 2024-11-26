import React from 'react';
import styles from './OrderItem.module.css';
import { TrashIcon } from '../../svgIcon/svgIndex';

function QuantityControl({ quantity, onIncrease, onDecrease, onRemove }) {
  return (
    <div className={styles.quantityControl} onClick={(e) => e.stopPropagation()}>
      {quantity === 1 ? (
        <span className={styles.controlButton} onClick={onRemove}>
          <TrashIcon className={styles.TrashIcon} />
        </span>
      ) : (
        <span
          className={styles.controlButton}
          onClick={(e) => {
            e.stopPropagation();
            onDecrease();
          }}
        >
          -
        </span>
      )}
      <span className={styles.quantity}>{quantity}</span>
      <span
        className={styles.controlButton}
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
      >
        +
      </span>
    </div>
  );
}

export default QuantityControl; 