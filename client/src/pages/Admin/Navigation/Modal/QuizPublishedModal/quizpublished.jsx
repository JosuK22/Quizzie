import { X } from 'lucide-react';
import { Text } from '../../../../../components/ui';
import styles from './quizpublished.module.css';

const QuizPublishedModal = ({toggleModal}) => {
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
              value='' 
              readOnly 
              placeholder='' 
              className={styles.linkInput}
            />
          </div>
          <button className={styles.shareButton}>Share</button>
        </div>
      </div>
    );
  };
  
  export default QuizPublishedModal;