import  { useEffect, useState } from 'react';
import axios from 'axios';  
import { Text } from '../../../../components/ui';
import { BACKEND_URL } from '../../../../utils/connection';
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
  const questionText = questions && questions.length > 0 ? questions[0].question_text : 'No question available';


  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <Text step={7} weight='800' color='#5076FF'>{data.name} Question Wise Analysis</Text>
        </div>
        
        <div className={styles.statscard}>
          <div className={styles.span}>
            <Text step={8} weight='700' ></Text>
          </div>
          <Text step={6} weight='600' ></Text>
        </div>

        

        <p><strong>Impressions:</strong> {impressions}</p>
        <p><strong>Created Date:</strong> {createdAt ? formatDate(createdAt) : 'Date not available'}</p>
        <p><strong>Question Text:</strong> {questionText}</p>
      {/* <p>{data ? JSON.stringify(data, null, 2) : 'No data available'}</p> */}
    </div>
  );
};

export default QuestionAnalysis;
