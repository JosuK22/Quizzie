import Stats from './LocalComponents/StatsCard/statscard';
import QuizCard from './LocalComponents/QuizCard/quizcard';
import { Text } from '../../../components/ui';
import styles from './index.module.css';

export default function Board() {
  
  return (
    <div className={styles.container}>

      <div className={styles.stats}>
        <Stats></Stats>
        <Stats type={'questions'}></Stats>
        <Stats type={'impression'}></Stats>
      </div>

      <div className={styles.quizContainer}>
          <Text step={5} weight='700' >Trending Quizs</Text>
          <div className={styles.quizList}>
            <QuizCard></QuizCard>
            <QuizCard></QuizCard>
            <QuizCard></QuizCard>
            <QuizCard></QuizCard>
            <QuizCard></QuizCard>
            <QuizCard></QuizCard>
            <QuizCard></QuizCard>
            <QuizCard></QuizCard>
          </div>
      </div>

    </div>
  );
}
