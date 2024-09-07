import PropTypes from 'prop-types';
import { Text } from '../../../components/ui';
import IMG from '../../../assets/pngegg.png';
import IMG2 from '../../../assets/Pop.png';
import styles from './startcard.module.css';

function StartCard({ quizType, onStart }) {
    const type = quizType;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text step={8} weight='700'>{quizType === 'Q&A' ? 'You have been invited to take a quiz' : 'You have been invited to this poll'}</Text>
      </div>
      <div className={styles.body}>
        <div className={styles.image}>
            <img src={IMG2} alt="" className={styles.img1} />
            <img src={IMG} alt="" className={styles.img2} />
        </div>
        <button className={styles.startButton} onClick={onStart}>
          Start
        </button>
      </div>
      <div className={styles.footer}>
        
          {quizType === 'Q&A' ? (<Text>Click start to begin the quiz</Text>) : (<Text step={6}>Click <strong onClick={onStart} className={styles.strong}>START</strong> to share your opinions!</Text>)}
        
      </div>
    </div>
  );
}

StartCard.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default StartCard;

