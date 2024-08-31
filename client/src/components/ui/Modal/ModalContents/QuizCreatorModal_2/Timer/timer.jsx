import { useState, useEffect } from 'react';
import Text from '../../../../Text/Text';
import styles from './timer.module.css';

const Timer = ({ onTimeChange }) => {
  const [selectedTime, setSelectedTime] = useState(null); // null means the timer is off

  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(selectedTime);
    }
  }, [selectedTime, onTimeChange]);

  return (
    <div className={styles.timerContainer}>
      <Text step={4} weight='700' color='gray'>TIMER</Text>
      <div
        className={`${styles.timerButton} ${selectedTime !== null ? styles.offSelected : ''}`}
        onClick={() => setSelectedTime(null)}
      >
        OFF
      </div>
      <div
        className={`${styles.timerOption} ${selectedTime === '5' ? styles.selected : ''}`}
        onClick={() => setSelectedTime('5')}
      >
        5 sec
      </div>
      <div
        className={`${styles.timerOption} ${selectedTime === '10' ? styles.selected : ''}`}
        onClick={() => setSelectedTime('10')}
      >
        10 sec
      </div>
    </div>
  );
};

export default Timer;

