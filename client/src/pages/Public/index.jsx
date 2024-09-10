import { useParams} from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { Text } from '../../components/ui';
import { BACKEND_URL } from '../../utils/connection';
import StartCard from './startCard/startcard';
import QuizCard from './quizCard/quizCard';
import VictoryCard from './victoryCard/victorycard';
import styles from './index.module.css';
import { useEffect, useState } from 'react';

export default function PublicLayout() {
  const { quizId } = useParams(); 
  const url = `${BACKEND_URL}/api/v1/quiz/${quizId}`;
  const { data, isLoading, error, refetch } = useFetch(url); 
  const [pageState, setPageState] = useState('start'); // 'start', 'quiz', 'victory'
  

  useEffect(() => {
    const updateImpressions = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/v1/quiz/${quizId}/increment-impressions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.error('Failed to update impressions:', err);
      }
    };

    updateImpressions();
  }, [quizId]);
  
  useEffect(() => {
    const storedScore = localStorage.getItem(`quiz_${quizId}_score`);
    const isSubmitted = localStorage.getItem(`quiz_${quizId}_submitted`);
    
    if (isSubmitted === 'true') {
      setPageState('victory');
    } else if (storedScore !== null) {
      setPageState('quiz');
    }
  }, []);

  const handleStart = () => {
    setPageState('quiz');
  };

  const handleFinish = (score) => {
    localStorage.setItem(`quiz_${quizId}_score`, score);
    localStorage.setItem(`quiz_${quizId}_submitted`, 'true');
    setPageState('victory');
  };

  const handleRestart = () => {
    localStorage.removeItem(`quiz_${quizId}_score`);
    localStorage.removeItem(`quiz_${quizId}_submitted`);
    setPageState('start');
  };

  let content;

  if (isLoading) {
    content = (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <Text step={4} color='white'>Loading</Text>
      </div>
  );
  }

  if (error) {
    content = <div>Error: {error.message}</div>;
  }

  if (data) {
    switch (pageState) {
      case 'start':
        content = (
          <div className={styles.content}>
            <StartCard onStart={handleStart} quizType={data.type}/>
          </div>
        );
        break;
      case 'quiz':
        content = (
          <div className={styles.content}>
            <QuizCard quiz={data} onFinish={handleFinish} />
          </div>
        );
        break;
      case 'victory':
        const score = localStorage.getItem(`quiz_${quizId}_score`);
        content = (
          <div className={styles.content}>
            <VictoryCard
              score={parseInt(score, 10) || 0}
              totalQuestions={data.questions.length}
              quizType={data.type}
              onRestart={handleRestart}
            />
          </div>
        );
        break;
      default:
        content = <div>Invalid state</div>;
    }
  }

  return (
    <div className={styles.container}>
      {content}
    </div>
  );
}
