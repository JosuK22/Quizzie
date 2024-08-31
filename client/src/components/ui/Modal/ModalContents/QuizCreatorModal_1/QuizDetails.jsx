import { useState } from 'react';
import styles from './quizdetails.module.css';

const QuizDetails = ({ toggleModal, onContinue }) => {
  const [selectedType, setSelectedType] = useState('Q&A');
  const [quizName, setQuizName] = useState('');
  const [isQuizNameInvalid, setIsQuizNameInvalid] = useState(false);

  const handleContinue = () => {
    if (!quizName.trim()) {
      setIsQuizNameInvalid(true);
      return; 
    }

    setIsQuizNameInvalid(false);
    onContinue(selectedType,quizName); 
  };

  return (
    <div className={styles.modalContent}>
      <input
        className={`${styles.inputField} ${isQuizNameInvalid ? styles.invalidInput : ''}`}
        placeholder={'Enter Quiz name'}
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
      />
      <div className={styles.quizTypeContainer}>
        <span className={styles.quizTypeLabel}>Quiz Type</span>
        <div className={styles.quizTypeOptions}>
          <button
            className={`${styles.optionButton} ${selectedType === 'Q&A' ? styles.selected : ''}`}
            onClick={() => setSelectedType('Q&A')}
          >
            Q & A
          </button>
          <button
            className={`${styles.optionButton} ${selectedType === 'Poll' ? styles.selected : ''}`}
            onClick={() => setSelectedType('Poll')}
          >
            Poll Type
          </button>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.cancelButton} onClick={toggleModal}>Cancel</button>
        <button className={styles.continueButton} onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

export default QuizDetails;

