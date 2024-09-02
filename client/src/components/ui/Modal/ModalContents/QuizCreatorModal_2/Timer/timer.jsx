import { useState, useEffect } from 'react';
import Text from '../../../../Text/Text';
import styles from './timer.module.css';

const Timer = ({ onTimeChange, initialTime }) => {
  const [selectedTime, setSelectedTime] = useState(initialTime ? String(initialTime) : 'off');

  useEffect(() => {
    setSelectedTime(initialTime ? String(initialTime) : 'off');
  }, [initialTime]);

  useEffect(() => {
    const timeValue = selectedTime === 'off' ? null : Number(selectedTime);
    if (onTimeChange) {
      onTimeChange(timeValue);
    }
  }, [selectedTime, onTimeChange]);

  return (
    <div className={styles.timerContainer}>
      <Text step={4} weight='700' color='gray'>TIMER</Text>
      <div
        className={`${styles.timerButton} ${selectedTime === 'off' ? styles.selected : ''}`}
        onClick={() => setSelectedTime('off')}
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
