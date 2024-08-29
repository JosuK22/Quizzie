import { useState } from 'react';
import styles from './table.module.css';
import { Text } from '../../../../components/ui';
import copyLink from '../../../../utils/copyLink';
import { Share2, FilePenLine, Trash2 } from 'lucide-react';
import {Modal, DeleteConfirmation} from '../../../../components/ui';
import useModal from '../../../../hooks/useModal';
import { useQuiz } from '../../../../store/QuizProvider'; // Import useQuiz

const QuizTable = ({ onViewAnalysis }) => {
  const { quizzes, deleteQuiz, loading, error } = useQuiz(); // Use deleteQuiz from QuizProvider
  const { isOpen, toggleModal } = useModal(); // Destructure the modal state and toggle function
  const [selectedQuizId, setSelectedQuizId] = useState(null); // State to keep track of which quiz is being deleted

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDeleteClick = (id) => {
    setSelectedQuizId(id); // Set the quiz ID that is being deleted
    toggleModal(); // Open the modal
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteQuiz(selectedQuizId); 
      toggleModal(); 
    } catch (err) {
      console.error('Error:', err.message);
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
            <th></th>
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
                <div className={styles.butonContainer}>
                  <button className={styles.editBtn}><FilePenLine size={17}/></button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteClick(quiz._id)}
                  >
                    <Trash2 size={17}/>
                  </button>
                  <button
                    className={styles.shareBtn}
                    onClick={() => copyLink(quiz._id)}
                  >
                    <Share2 size={17}/>
                  </button>
                  <button
                    className={styles.analysisLink}
                    onClick={() => onViewAnalysis(quiz._id)}
                  >
                    Question Wise Analysis
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render the modal with DeleteConfirmation as children */}
      {isOpen && (
        <Modal toggleModal={toggleModal}>
          <DeleteConfirmation
            onDelete={handleConfirmDelete}
            onCancel={toggleModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default QuizTable;