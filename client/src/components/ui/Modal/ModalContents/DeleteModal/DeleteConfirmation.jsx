import styles from './DeleteConfirmation.module.css';
import Text from '../../../Text/Text';

const DeleteConfirmation = ({ onDelete, onCancel }) => {
  return (
    <div className={styles.deleteConfirmation}>
      <Text step={5} weight='600'>Are you sure you want to delete this quiz?</Text>
      <div className={styles.buttonGroup}>
        <button className={styles.confirmBtn} onClick={onDelete}>
          Confirm Delete
        </button>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
