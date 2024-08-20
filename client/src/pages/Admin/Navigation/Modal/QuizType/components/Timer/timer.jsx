import { useState } from 'react';
import { Text } from '../../../../../../../components/ui';
import styles from './timer.module.css';

const Timer = () => {
  const [selectedTime, setSelectedTime] = useState(null); // null means the timer is off

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
