import { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, StatCard } from '../../../../components/ui';
import { BACKEND_URL } from '../../../../utils/connection';
import { ArrowLeft } from 'lucide-react';
import styles from './questionAnalysis.module.css';

const QuestionAnalysis = ({ quizId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/quiz/${quizId}`);
        setData(response.data);  // Assuming response.data contains the analysis data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [quizId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Extracting data
  const { impressions, createdAt, questions } = data || {};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
      
        <div className={styles.right}>
          <Text step={7} weight='800' color='#5076FF'>{data.name} : Question Wise Analysis</Text>
        </div>

        <div className={styles.left}>
          <Text color='orange'><strong>Created Date:</strong> {createdAt ? formatDate(createdAt) : 'Date not available'}</Text>
          <Text color='orange'><strong>Impressions:</strong> {impressions}</Text>
        </div>
      </div>

      <div className={styles.body}>
        {questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={question.question_number} className={styles.questionDetails}>
              <Text step={7} ><strong>Q.{index + 1} : </strong>{question.question_text}</Text>
              <div className={styles.wrapper}>
                <StatCard 
                  value={question.attempts} 
                  label="People Attempted the question" 
                />
                <StatCard 
                  value={question.correct_attempts} 
                  label="People Answered Correctly" 
                />
                <StatCard 
                  value={question.attempts - question.correct_attempts} 
                  label="People Answered Incorrectly" 
                />
              </div>
            </div>
          ))
        ) : (
          <Text>No questions available</Text>
        )}
      </div>
    </div>
  );
};

export default QuestionAnalysis;
