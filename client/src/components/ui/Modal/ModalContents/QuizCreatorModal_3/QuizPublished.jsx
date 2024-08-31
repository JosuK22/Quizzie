import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Text from '../../../Text/Text';
import copyLink from '../../../../../utils/copyLink';
import styles from './quizpublished.module.css';

const QuizPublishedModal = ({ toggleModal, quizId }) => {
  const [quizLink, setQuizLink] = useState('');

  useEffect(() => {
    if (quizId) {
      const url = new URL(window.location.href);
      url.pathname = `quiz/${quizId}`;
      setQuizLink(url.href);
    }
  }, [quizId]);

  const handleShareClick = () => {
      copyLink(quizId)
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.button}>
          <button className={styles.close} onClick={toggleModal}><X/></button>
        </div>
        <Text step={7} weight='700'>Congrats your Quiz is Published!</Text>
        <div className={styles.linkContainer}>
          <input 
            type="text" 
            value={quizLink} 
            readOnly 
            className={styles.linkInput}
          />
        </div>
        <button className={styles.shareButton} onClick={handleShareClick}>Share</button>
      </div>
    </div>
  );
};

export default QuizPublishedModal;