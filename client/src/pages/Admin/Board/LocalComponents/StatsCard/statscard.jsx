import styles from './statscard.module.css';
import { Text } from '../../../../../components/ui';
import { useQuiz } from '../../../../../store/QuizProvider';
import PropTypes from 'prop-types';

export default function Statscard({ type }) {
  const { quizCount, questionCount, totalImpressions } = useQuiz(); // Get stats from context

  const cardText = [
    { title: 'Quiz Created', value: quizCount, color: '#FF5D01' },
    { title: 'Questions Created', value: questionCount, color: '#60B84B' },
    { title: 'Total Impressions', value: totalImpressions, color: '#5076FF' },
  ];

  const cardData = cardText.find((item) => 
    item.title.toLowerCase().includes(type.toLowerCase())
  );

  if (!cardData) {
    return <div>Invalid type</div>;
  }

  return (
    <div className={styles.statscard}>
      <div className={styles.span}>
        <Text step={8} weight='700' color={cardData.color}>{cardData.value}</Text>
      </div>
      <Text step={6} weight='600' color={cardData.color}>{cardData.title}</Text>
    </div>
  );
}

Statscard.defaultProps = {
  type: 'quiz', 
};

Statscard.propTypes = {
  type: PropTypes.string,
};
