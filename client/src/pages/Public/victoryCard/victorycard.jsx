// victorycard.jsx
import PropTypes from 'prop-types';
import Trophy from '../../../assets/trophy.png';
import { Text } from '../../../components/ui';
import styles from './victory.module.css';

function VictoryCard({ score, totalQuestions }) {
  const formattedScore = `${String(score).padStart(2, '0')}/${String(totalQuestions).padStart(2, '0')}`;

  return (
    <div className={styles.container}>
      <Text step={8} weight='700'>Congrats! Quiz is completed</Text>
      <img src={Trophy} alt="Trophy" />
      <Text step={8} weight='700'>Your Score is:</Text>
      <Text step={8} weight='700' color='#60B84B'>{formattedScore}</Text>
    </div>
  );
}

VictoryCard.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

export default VictoryCard;
