import { Trash2 } from 'lucide-react';
import styles from './options.module.css';

const OptionsContainer = ({ 
  options, 
  selectedOptionIndex, 
  onOptionChange, 
  onRadioChange, 
  onRemoveOption, 
  onAddOption,
  errorState,
  quizType // Add quizType prop
}) => {
  return (
    <div className={styles.optionsContainer}>
      {options.map((option, optionIndex) => (
        <div className={styles.optionRow} key={optionIndex}>
          {quizType === 'Q&A' && (
            <input
              type="radio"
              name={`optionRadio-${optionIndex}`} // Fixed name attribute
              checked={selectedOptionIndex === optionIndex}
              onChange={() => onRadioChange(optionIndex)}
              className={styles.optionRadio}
            />
          )}
          <input
            className={`${styles.optionInput} ${errorState.optionsError && !option.trim() ? styles.error : ''}`}
            type="text"
            value={option}
            placeholder="Text"
            style={{ backgroundColor: selectedOptionIndex === optionIndex ? 'lightgreen' : 'transparent' }}
            onChange={(e) => onOptionChange(optionIndex, e.target.value)}
          />
          {options.length > 2 && (
            <button className={styles.removeButton} onClick={() => onRemoveOption(optionIndex)}>
              <Trash2 color='red' size={18}/>
            </button>
          )}
        </div>
      ))}
      {options.length < 4 && (
        <button className={styles.addOptionButton} onClick={onAddOption}>
          Add option
        </button>
      )}
    </div>
  );
};


export default OptionsContainer;
