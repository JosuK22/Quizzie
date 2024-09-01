import Text from '../Text/Text';
import styles from './statcard.module.css';

const StatCard = ({ value, label }) => {
  return (
    <div className={styles.statscard}>
      
      <div className={styles.span}>
        <Text step={8} weight='700' color='#474444'>{value}</Text>
      </div>
      <div className={styles.span}>
        <Text step={2} weight='600' color='#474444'>{label}</Text>
      </div>
      
    </div>
  );
};

export default StatCard;
