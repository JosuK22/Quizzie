import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { BACKEND_URL } from '../../utils/connection';
import QuizCard from './quizCard/quizCard';
import styles from './index.module.css';
import { useEffect } from 'react';

export default function PublicLayout() {
  const { quizId } = useParams(); 
  const url = `${BACKEND_URL}/api/v1/quiz/${quizId}`;
  const { data, isLoading, error, refetch } = useFetch(url); 

  useEffect(() => {
    const updateImpressions = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/v1/quiz/${quizId}/increment-impressions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        refetch();
      } catch (err) {
        console.error('Failed to update impressions:', err);
      }
    };

    updateImpressions();
  }, [quizId, refetch]);

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  }

  if (error) {
    content = <div>Error: {error.message}</div>;
  }

  if (data) {
    content = (
      <div className={styles.content}>
        <QuizCard quiz={data} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {content}
    </div>
  );
}
