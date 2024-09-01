import { useState } from 'react';
import styles from './table.module.css';
import { Text } from '../../../../components/ui';
import copyLink from '../../../../utils/copyLink';
import { Share2, FilePenLine, Trash2 } from 'lucide-react';
import { Modal, DeleteConfirmation, QuizQuestionDetails } from '../../../../components/ui';
import useModal from '../../../../hooks/useModal';
import { useQuiz } from '../../../../store/QuizProvider'; // Import useQuiz
import axios from 'axios';
import { BACKEND_URL } from '../../../../utils/connection';

const QuizTable = ({ onViewAnalysis }) => {
  const { quizzes, deleteQuiz, loading, error } = useQuiz(); // Use deleteQuiz from QuizProvider
  const { isOpen, toggleModal } = useModal(); // Destructure the modal state and toggle function
  const [selectedQuizId, setSelectedQuizId] = useState(null); // State to keep track of which quiz is being deleted
  const [modalContent, setModalContent] = useState(null); // State to keep track of modal content
  const [quizDetails, setQuizDetails] = useState(null); // State to store quiz details

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDeleteClick = (id) => {
    setSelectedQuizId(id); // Set the quiz ID that is being deleted
    setModalContent('delete'); // Set the modal content type to delete confirmation
    toggleModal(); // Open the modal
  };

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/quiz/${id}`);
      setQuizDetails(response.data); // Set the quiz details
      setSelectedQuizId(id); // Set the quiz ID that is being edited
      setModalContent('details'); // Set the modal content type to quiz details
      toggleModal(); // Open the modal
    } catch (err) {
      console.error('Error fetching quiz details:', err.message);
    }
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
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditClick(quiz._id)}
                  >
                    <FilePenLine size={17}/>
                  </button>
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

      {/* Render the modal with different content based on modalContent state */}
      {isOpen && (
        <Modal toggleModal={toggleModal}>
          {modalContent === 'delete' ? (
            <DeleteConfirmation
              onDelete={handleConfirmDelete}
              onCancel={toggleModal}
            />
          ) : (
            <QuizQuestionDetails 
              toggleModal={toggleModal}
              quizType={quizDetails?.type || ''}
              quizName={quizDetails?.name || ''}
              setModalContent={setModalContent}
              quizData={quizDetails} // Pass quiz data to QuestionDetails
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default QuizTable;
