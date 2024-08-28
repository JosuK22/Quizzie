import styles from './table.module.css';
import { Text } from '../../../../components/ui';
import copyLink from '../../../../utils/copyLink';

import { useQuiz } from '../../../../store/QuizProvider'; // Import useQuiz

const QuizTable = ({ onViewAnalysis }) => {
  const { quizzes, deleteQuiz, loading, error } = useQuiz(); // Use deleteQuiz from QuizProvider

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id); // Use deleteQuiz from QuizProvider
      } catch (err) {
        console.error('Error:', err.message);
      }
    }
  };

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
