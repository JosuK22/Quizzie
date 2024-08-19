import { useState } from 'react';
import {Trash2} from 'lucide-react'
import { Text } from '../../../../../components/ui';
import styles from './quiztype.module.css';

const QuizCreator = ({ toggleModal }) => {
  const [questionsData, setQuestionsData] = useState([
    { question: '', options: ['', ''], optionType: 'text', selectedOption: null }
  ]);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[index].question = value;
    setQuestionsData(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestionsData(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questionsData];
    if (updatedQuestions[questionIndex].options.length < 5) {
      updatedQuestions[questionIndex].options.push('');
      setQuestionsData(updatedQuestions);
    }
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestionsData(updatedQuestions);
  };

  const handleOptionTypeChange = (index, type) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[index].optionType = type;
    setQuestionsData(updatedQuestions);
  };

  const handleRadioChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[questionIndex].selectedOption = optionIndex;
    setQuestionsData(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (questionsData.length < 5) {
      setQuestionsData([
        ...questionsData,
        { question: '', options: ['', ''], optionType: 'text', selectedOption: null }
      ]);
      setSelectedQuestionIndex(questionsData.length);
    }
  };

  const handleCancel = () => {
    setQuestionsData([
      { question: '', options: ['', ''], optionType: 'text', selectedOption: null }
    ]);
    setSelectedQuestionIndex(0);
    toggleModal(); // Close the modal
  };

  const handleDeleteQuestion = () => {
    if (questionsData.length > 1) {
      const updatedQuestions = questionsData.filter((_, i) => i !== selectedQuestionIndex);
      setQuestionsData(updatedQuestions);

      const newIndex = Math.max(0, selectedQuestionIndex - 1);
      setSelectedQuestionIndex(newIndex);
    }
  };

  const handleCreateQuiz = () => {
    console.log('Quiz Created:', questionsData);
  };

  return (
    <div className={styles.quizContainer}>
      <div className={styles.questionHeader}>
        <div className={styles.questions}>
          {questionsData.map((_, index) => (
            <div
              key={index}
              className={`${styles.questionNumber} ${selectedQuestionIndex === index ? styles.selected : ''}`}
              onClick={() => setSelectedQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
          {questionsData.length < 5 && (
            <button className={styles.addQuestionButton} onClick={handleAddQuestion}>+</button>
          )}
        </div>
        <Text step={2} color='gray'>Max 5 questions</Text>
      </div>

      <input
        className={styles.questionInput}
        type="text"
        value={questionsData[selectedQuestionIndex]?.question || ''}
        placeholder="Poll Question"
        onChange={(e) => handleQuestionChange(selectedQuestionIndex, e.target.value)}
      />

      <div className={styles.optionTypeContainer}>
        <Text weight='500'>Option Type :</Text>
        {['text', 'image', 'textImage'].map(type => (
          <label className={questionsData[selectedQuestionIndex]?.optionType === type ? styles.selected : ''} key={type}>
            <input
              type="radio"
              name={`optionType-${selectedQuestionIndex}`}
              value={type}
              checked={questionsData[selectedQuestionIndex]?.optionType === type}
              onChange={() => handleOptionTypeChange(selectedQuestionIndex, type)}
            /> {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
        ))}
      </div>

      <div className={styles.optionsContainer}>
        {questionsData[selectedQuestionIndex]?.options.map((option, optionIndex) => (
          <div className={styles.optionRow} key={optionIndex}>
            <input
              type="radio"
              name={`optionRadio-${selectedQuestionIndex}`}
              checked={questionsData[selectedQuestionIndex]?.selectedOption === optionIndex}
              onChange={() => handleRadioChange(selectedQuestionIndex, optionIndex)}
              className={styles.optionRadio}
            />
            <input
              className={styles.optionInput}
              type="text"
              value={option}
              placeholder="Text"
              style={{ backgroundColor: questionsData[selectedQuestionIndex]?.selectedOption === optionIndex ? 'lightgreen' : 'transparent' }}
              onChange={(e) => handleOptionChange(selectedQuestionIndex, optionIndex, e.target.value)}
            />
            {questionsData[selectedQuestionIndex]?.options.length > 2 && (
              <button className={styles.removeButton} onClick={() => handleRemoveOption(selectedQuestionIndex, optionIndex)}>
                <Trash2 color='red' size={18}/>
              </button>
            )}
          </div>
        ))}
        {questionsData[selectedQuestionIndex]?.options.length < 4 && (
          <button className={styles.addOptionButton} onClick={() => handleAddOption(selectedQuestionIndex)}>
            Add option
          </button>
        )}
      </div>

      <div className={styles.actionButtons}>
        <div className={styles.caution}>
          <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
          <button className={styles.cancelButton} onClick={handleDeleteQuestion}>Delete Question</button>
        </div>
        <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
    </div>
  );
};

export default QuizCreator;
