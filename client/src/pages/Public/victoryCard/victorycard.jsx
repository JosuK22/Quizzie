// victorycard.jsx
import PropTypes from 'prop-types';
import Trophy from '../../../assets/trophy.png';
import { Text } from '../../../components/ui';
import { useEffect } from 'react';
import styles from './victory.module.css';

function VictoryCard({ score, totalQuestions, quizType, onRestart }) {
  const formattedScore = `${String(score).padStart(2, '0')}/${String(totalQuestions).padStart(2, '0')}`;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      onRestart(); // Redirect back to start
      e.returnValue = ''; // For older browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onRestart]);

  return (
    <div className={styles.container}>
      {quizType === 'Q&A' ? (
        <>
          <Text step={8} weight='700'>Congrats! Quiz is completed</Text>
          <img src={Trophy} alt="Trophy" />
          <Text step={8} weight='700'>Your Score is:</Text>
          <Text step={8} weight='700' color='#60B84B'>{formattedScore}</Text>
        </>
      ) : quizType === 'Poll' ? (
        <>
          <Text step={8} weight='700'>Congrats! Poll is completed</Text>
          <img src={Trophy} alt="Trophy" />
          <Text step={8} weight='700'>Thank You for Participating in this Poll</Text>
          <Text step={8} weight='700'></Text>
        </>
      ) : null}
    </div>
  );
}

VictoryCard.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  quizType: PropTypes.oneOf(['Q&A', 'Poll']).isRequired,
  onRestart: PropTypes.func.isRequired,
};

export default VictoryCard;
