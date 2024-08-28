import React from 'react';
import { useQuiz } from '../../../store/QuizProvider'; // Adjust path as needed
import Stats from './LocalComponents/StatsCard/statscard';
import QuizCard from './LocalComponents/QuizCard/quizcard';
import { Text } from '../../../components/ui';
import styles from './index.module.css';

export default function Board() {
  const { trendingQuizzes, loading, error } = useQuiz();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <Stats />
        <Stats type={'questions'} />
        <Stats type={'impression'} />
      </div>

      <div className={styles.quizContainer}>
        <Text step={5} weight='700'>Trending Quizzes</Text>
        <div className={styles.quizList}>
          {trendingQuizzes.map(quiz => (
            <QuizCard
              key={quiz._id}
              name={quiz.name}
              impressions={quiz.impressions}
              createdAt={quiz.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
