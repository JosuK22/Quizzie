// OptionsContainer.jsx
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
  optionType,
  quizType,
  isOptionSelectionDisabled = false,
  canModifyOptions = true,
}) => {
  return (
    <div className={styles.optionsContainer}>
      {options.map((option, optionIndex) => (
        <div className={styles.optionRow} key={optionIndex}>
          {quizType === 'Q&A' && (
            <input
              type="radio"
              name={`optionRadio-${optionIndex}`}
              checked={selectedOptionIndex === optionIndex}
              onChange={() => onRadioChange(optionIndex)}
              className={styles.optionRadio}
              disabled={isOptionSelectionDisabled}
            />
          )}

          {/* Render Option Inputs Based on optionType */}
          {optionType === 'text' && (
            <input
              className={`${styles.optionInput} ${
                errorState.optionsError && !option.text.trim() ? styles.error : ''
              }`}
              type="text"
              value={option.text}
              placeholder="Text"
              style={{ backgroundColor: selectedOptionIndex === optionIndex ? 'lightgreen' : 'transparent' }}
              onChange={(e) => onOptionChange(optionIndex, { text: e.target.value })}
            />
          )}

          {optionType === 'image' && (
            <input
              className={`${styles.optionInput} ${
                errorState.optionsError && !option.image_url.trim() ? styles.error : ''
              }`}
              type="text"
              value={option.image_url}
              placeholder="Image URL"
              style={{ backgroundColor: selectedOptionIndex === optionIndex ? 'lightgreen' : 'transparent' }}
              onChange={(e) => onOptionChange(optionIndex, { image_url: e.target.value })}
            />
          )}

          {optionType === 'textImage' && (
            <>
              <input
                className={`${styles.optionInput} ${styles.sgasgh} ${
                  errorState.optionsError && !option.text.trim() ? styles.error : ''
                }`}
                type="text"
                value={option.text}
                placeholder="Text"
                style={{ backgroundColor: selectedOptionIndex === optionIndex ? 'lightgreen' : 'transparent' }}
                onChange={(e) => onOptionChange(optionIndex, { text: e.target.value })}
              />
              <input
                className={`${styles.optionInput} ${
                  errorState.optionsError && !option.image_url.trim() ? styles.error : ''
                }`}
                type="text"
                value={option.image_url}
                placeholder="Image URL"
                style={{ backgroundColor: selectedOptionIndex === optionIndex ? 'lightgreen' : 'transparent' }}
                onChange={(e) => onOptionChange(optionIndex, { image_url: e.target.value })}
              />
            </>
          )}

          {/* Remove Option Button */}
          {canModifyOptions && options.length > 2 && (
            <button className={styles.removeButton} onClick={() => onRemoveOption(optionIndex)}>
              <Trash2 color="red" size={18} />
            </button>
          )}
        </div>
      ))}

      {/* Add Option Button */}
      {canModifyOptions && options.length < 4 && (
        <div className={styles.wrapper}>
          <button className={styles.addOptionButton} onClick={onAddOption}>
            Add option
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionsContainer;

