import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';  
import { BACKEND_URL } from '../../../../utils/connection';  
import styles from './table.module.css';
import { Text } from '../../../../components/ui';
import copyLink from '../../../../utils/copyLink';
import { AuthContext } from '../../../../store/AuthProvider'; 

const QuizTable = ({ onViewAnalysis }) => {
  const { user } = useContext(AuthContext); 
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/quiz`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setQuizzes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchQuizzes();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/v1/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.quizTableContainer}>
      <Text step={8} color='#5076FF' weight='700'>Quiz Analysis</Text>
      <table className={styles.quizTable}>
        <thead>
          <tr className={styles.tablehead}>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz._id} className={styles.tableRow}>
              <td className={styles.cell}>{index + 1}</td>
              <td className={styles.cell}>{quiz.name}</td>
              <td className={styles.cell}>
                {new Date(quiz.createdAt).toLocaleDateString()}
              </td>
              <td className={styles.cell}>{quiz.impressions}</td>
              <td className={styles.cell}>
                <button className={styles.editBtn}>✏️</button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(quiz._id)}
                >
                  🗑️
                </button>
                <button
                  className={styles.shareBtn}
                  onClick={() => copyLink(quiz._id)}
                >
                  🔗
                </button>
                <button
                  className={styles.analysisLink}
                  onClick={() => onViewAnalysis(quiz._id)}
                >
                  Question Wise Analysis
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
