// public.jsx
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { BACKEND_URL } from '../../utils/connection';
import QuizCard from './quizCard/quizCard';
import styles from './index.module.css';

export default function PublicLayout() {
  const { quizId } = useParams(); // Assume URL has a parameter for quiz ID
  const url = `${BACKEND_URL}/api/v1/quiz/${quizId}`;
  const { data, isLoading, error } = useFetch(url);

  console.log('Fetching URL:', url);
  console.log('Data:', data);
  console.log('Error:', error);

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
