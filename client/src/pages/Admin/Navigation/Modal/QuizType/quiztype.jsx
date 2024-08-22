import { useState, useEffect } from 'react';
import { Text } from '../../../../../components/ui';
import Timer from './components/Timer/timer';
import toast, { Toaster } from 'react-hot-toast';
import OptionsContainer from './components/Options/options';
import styles from './quiztype.module.css';

const QuizCreator = ({ toggleModal, quizType }) => {
  const [time, setTime] = useState(null);
  const [questionsData, setQuestionsData] = useState([
    {type: quizType, question: '', options: ['', ''], optionType: 'text', selectedOption: null, timer: null }
  ]);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [errorState, setErrorState] = useState({
    questionError: false,
    optionsError: false,
    optionSelectedError: false
  });

  useEffect(() => {
    // Update the timer for the selected question whenever time changes
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].timer = time;
    setQuestionsData(updatedQuestions);
  }, [time, selectedQuestionIndex]);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[index].question = value;
    setQuestionsData(updatedQuestions);
    if (value.trim()) {
      setErrorState(prevState => ({ ...prevState, questionError: false }));
    }
  };

  const handleOptionChange = (optionIndex, value) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].options[optionIndex] = value;
    setQuestionsData(updatedQuestions);
    if (value.trim()) {
      setErrorState(prevState => ({
        ...prevState,
        optionsError: false,
        optionSelectedError: false
      }));
    }
  };

  const handleAddOption = () => {
    const updatedQuestions = [...questionsData];
    if (updatedQuestions[selectedQuestionIndex].options.length < 5) {
      updatedQuestions[selectedQuestionIndex].options.push('');
      setQuestionsData(updatedQuestions);
    }
  };

  const handleRemoveOption = (optionIndex) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].options = updatedQuestions[selectedQuestionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestionsData(updatedQuestions);
  };

  const handleOptionTypeChange = (type) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].optionType = type;
    setQuestionsData(updatedQuestions);
  };

  const handleRadioChange = (optionIndex) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].selectedOption = optionIndex;
    setQuestionsData(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (questionsData.length < 5) {
      setQuestionsData([
        ...questionsData,
        { question: '', options: ['', ''], optionType: 'text', selectedOption: null, timer: time }
      ]);
      setSelectedQuestionIndex(questionsData.length);
    }
  };

  const handleCancel = () => {
    setQuestionsData([
      { question: '', options: ['', ''], optionType: 'text', selectedOption: null, timer: time }
    ]);
    setSelectedQuestionIndex(0);
    toggleModal(); 
  };

  const handleDeleteQuestion = () => {
    if (questionsData.length > 1) {
      const updatedQuestions = questionsData.filter((_, i) => i !== selectedQuestionIndex);
      setQuestionsData(updatedQuestions);

      const newIndex = Math.max(0, selectedQuestionIndex - 1);
      setSelectedQuestionIndex(newIndex);
    }
  };

  const validateQuiz = () => {
    let hasError = false;

    if (questionsData.some(q => !q.question.trim())) {
      toast.error('Please fill out all questions.');
      setErrorState({
        questionError: true,
        optionsError: false,
        optionSelectedError: false
      });
      hasError = true;
      return false;
    }

    for (const q of questionsData) {
      const allOptionsFilled = q.options.every(option => option.trim());
      if (!allOptionsFilled) {
        toast.error('Please fill out all options.');
        setErrorState({
          questionError: false,
          optionsError: true,
          optionSelectedError: false
        });
        hasError = true;
        return false;
      }

      if (q.optionType === 'text' && q.selectedOption === null) {
        toast.error('Select an answer for the question.');
        setErrorState({
          questionError: false,
          optionsError: false,
          optionSelectedError: true
        });
        hasError = true;
        return false;
      }
    }

    setErrorState({
      questionError: false,
      optionsError: false,
      optionSelectedError: false
    });
    return true;
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  const handleCreateQuiz = () => {
    if (validateQuiz()) {
      console.log('Quiz Created:', time, questionsData);
    }
  };

  return (
    <div className={styles.quizContainer}>
      <Toaster /> 
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
        className={`${styles.questionInput} ${errorState.questionError ? styles.error : ''}`}
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
              onChange={() => handleOptionTypeChange(type)}
            /> {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
        ))}
      </div>

      <div className={styles.midsection}>
        <OptionsContainer
          options={questionsData[selectedQuestionIndex]?.options || []}
          selectedOptionIndex={questionsData[selectedQuestionIndex]?.selectedOption}
          onOptionChange={handleOptionChange}
          onRadioChange={handleRadioChange}
          onRemoveOption={handleRemoveOption}
          onAddOption={handleAddOption}
          errorState={errorState}
          quizType={quizType} 
        />
        {quizType === 'Q&A' && (
          <div className={styles.timer}>
            <Timer onTimeChange={handleTimeChange}/>
          </div>
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
