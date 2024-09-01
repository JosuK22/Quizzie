import { useState, useEffect, useContext } from 'react';
import Text from '../../../Text/Text';
import Timer from '../QuizCreatorModal_2/Timer/timer';
import OptionsContainer from '../QuizCreatorModal_2/Options/options';
import toast, { Toaster } from 'react-hot-toast';
import { BACKEND_URL } from '../../../../../utils/connection';
import { AuthContext } from '../../../../../store/AuthProvider';
import { useQuiz } from '../../../../../store/QuizProvider';
import styles from '../QuizCreatorModal_2/questiondetails.module.css';

const UpdateDetails = ({ toggleModal, quizId, setModalContent }) => {
  const [time, setTime] = useState(null);
  const { user } = useContext(AuthContext);
  const { updateQuiz } = useQuiz();
  const [questionsData, setQuestionsData] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [errorState, setErrorState] = useState({
    questionError: false,
    optionsError: false,
    optionSelectedError: false
  });
  const [quizType, setQuizType] = useState('Poll');
  const [quizName, setQuizName] = useState('');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/quiz/${quizId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setQuizName(result.name || '');
          setQuizType(result.type || 'Poll');
          setQuestionsData(result.questions.map((q, index) => ({
            ...q,
            timer: q.timer !== null ? q.timer.toString() : null,
            options: q.options.map(o => ({
              ...o,
              additional_url: o.additional_url || ''
            })),
          })));
          setTime(result.questions[0]?.timer || null);
        } else {
          toast.error(`Error: ${result.error}`);
        }
      } catch (error) {
        toast.error('An error occurred while fetching quiz details.');
        console.error('Error:', error);
      }
    };
    fetchQuizDetails();
  }, [quizId, user.token]);

  useEffect(() => {
    if (questionsData.length > 0) {
      const updatedQuestions = [...questionsData];
      updatedQuestions[selectedQuestionIndex].timer = time;
      setQuestionsData(updatedQuestions);
    }
  }, [time, selectedQuestionIndex]);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[index].question_text = value;
    setQuestionsData(updatedQuestions);
    if (value.trim()) {
      setErrorState(prevState => ({ ...prevState, questionError: false }));
    }
  };

  const handleOptionChange = (optionIndex, updatedOption) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].options[optionIndex] = {
      ...updatedQuestions[selectedQuestionIndex].options[optionIndex],
      ...updatedOption
    };
    setQuestionsData(updatedQuestions);
    if (Object.values(updatedOption).some(value => value.trim())) {
      setErrorState(prevState => ({
        ...prevState,
        optionsError: false,
        optionSelectedError: false
      }));
    }
  };

  const handleAddOption = () => {
    const updatedQuestions = [...questionsData];
    if (updatedQuestions[selectedQuestionIndex].options.length < 4) { // Change max options to 4
      const newOption = {};
      if (updatedQuestions[selectedQuestionIndex].optionType === 'text') {
        newOption.text = '';
        newOption.image_url = '';
      } else if (updatedQuestions[selectedQuestionIndex].optionType === 'image') {
        newOption.text = '';
        newOption.image_url = '';
      } else if (updatedQuestions[selectedQuestionIndex].optionType === 'textImage') {
        newOption.text = '';
        newOption.image_url = '';
        newOption.additional_url = '';
      }
      updatedQuestions[selectedQuestionIndex].options.push(newOption);
      setQuestionsData(updatedQuestions);
    }
  };

  const handleRemoveOption = (optionIndex) => {
    const updatedQuestions = [...questionsData];
    if (updatedQuestions[selectedQuestionIndex].options.length > 2) { // Minimum 2 options
      updatedQuestions[selectedQuestionIndex].options = updatedQuestions[selectedQuestionIndex].options.filter((_, i) => i !== optionIndex);
      setQuestionsData(updatedQuestions);
    }
  };

  const handleOptionTypeChange = (type) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].optionType = type;
    updatedQuestions[selectedQuestionIndex].options = updatedQuestions[selectedQuestionIndex].options.map(option => {
      const newOption = {};
      if (type === 'text') {
        newOption.text = option.text || '';
        newOption.image_url = option.image_url || '';
      } else if (type === 'image') {
        newOption.text = option.text || '';
        newOption.image_url = option.image_url || '';
      } else if (type === 'textImage') {
        newOption.text = option.text || '';
        newOption.image_url = option.image_url || '';
        newOption.additional_url = option.additional_url || '';
      }
      return newOption;
    });
    setQuestionsData(updatedQuestions);
  };

  const handleRadioChange = (optionIndex) => {
    const updatedQuestions = [...questionsData];
    updatedQuestions[selectedQuestionIndex].selectedOption = optionIndex;
    setQuestionsData(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (questionsData.length < 5) { // Max 5 questions
      setQuestionsData([
        ...questionsData,
        { question_text: '', options: [{ text: '', image_url: '' }, { text: '', image_url: '' }], optionType: 'text', selectedOption: null, timer: time }
      ]);
      setSelectedQuestionIndex(questionsData.length);
    }
  };

  const handleCancel = () => {
    toggleModal();
  };

  const handleDeleteQuestion = () => {
    if (questionsData.length > 1) { // Ensure at least one question remains
      const updatedQuestions = questionsData.filter((_, i) => i !== selectedQuestionIndex);
      setQuestionsData(updatedQuestions);
      const newIndex = Math.max(0, selectedQuestionIndex - 1);
      setSelectedQuestionIndex(newIndex);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateQuiz = () => {
    let hasError = false;

    if (questionsData.length < 1 || questionsData.length > 5) {
      toast.error('A quiz must have between 1 and 5 questions.');
      setErrorState({
        questionError: true,
        optionsError: false,
        optionSelectedError: false
      });
      hasError = true;
      return false;
    }

    if (questionsData.some(q => !q.question_text.trim())) {
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
      const allOptionsFilled = q.options.every(option => {
        const isTextValid = option.text.trim();
        const isImageValid = option.image_url ? isValidUrl(option.image_url) : true;
        const isAdditionalUrlValid = q.optionType === 'textImage' ? (option.additional_url ? isValidUrl(option.additional_url) : true) : true;

        return (q.optionType === 'text' && isTextValid) ||
               (q.optionType === 'image' && isImageValid) ||
               (q.optionType === 'textImage' && isTextValid && isImageValid && isAdditionalUrlValid);
      });

      if (!allOptionsFilled) {
        toast.error('Please use valid URLs.');
        setErrorState({
          questionError: false,
          optionsError: true,
          optionSelectedError: false
        });
        hasError = true;
        return false;
      }

      if (q.options.length < 2 || q.options.length > 4) {
        toast.error('Each question must have between 2 and 4 options.');
        setErrorState({
          questionError: false,
          optionsError: true,
          optionSelectedError: false
        });
        hasError = true;
        return false;
      }

      if (q.optionType === 'text' && q.options.some(opt => !opt.text.trim())) {
        toast.error('Please provide text for all options.');
        setErrorState({
          questionError: false,
          optionsError: true,
          optionSelectedError: false
        });
        hasError = true;
        return false;
      }

      if (q.optionType === 'image' && q.options.some(opt => !isValidUrl(opt.image_url))) {
        toast.error('Please provide valid image URLs.');
        setErrorState({
          questionError: false,
          optionsError: true,
          optionSelectedError: false
        });
        hasError = true;
        return false;
      }

      if (q.optionType === 'textImage' && q.options.some(opt => !opt.text.trim() || !isValidUrl(opt.image_url))) {
        toast.error('Please provide valid text and image URLs.');
        setErrorState({
          questionError: false,
          optionsError: true,
          optionSelectedError: false
        });
        hasError = true;
        return false;
      }
    }

    if (hasError) {
      return false;
    }

    return true;
  };

  const handleUpdateQuiz = async () => {
    if (validateQuiz()) {
      const quizDetails = {
        name: quizName,
        type: quizType,
        questions: questionsData.map(q => ({
          ...q,
          timer: q.timer !== null ? parseInt(q.timer, 10) : null
        })),
      };

      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/quiz/update/${quizId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(quizDetails),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success('Quiz updated successfully!');
          toggleModal();
        } else {
          toast.error(`Error: ${result.error}`);
        }
      } catch (error) {
        toast.error('An error occurred while updating the quiz.');
        console.error('Error:', error);
      }
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
        value={questionsData[selectedQuestionIndex]?.question_text || ''}
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
          optionType={questionsData[selectedQuestionIndex]?.optionType || 'text'}
          selectedOptionIndex={questionsData[selectedQuestionIndex]?.selectedOption}
          onOptionChange={handleOptionChange}
          onRadioChange={handleRadioChange}
          onRemoveOption={handleRemoveOption}
          onAddOption={handleAddOption}
          errorState={errorState}
          quizType={quizType} 
        />
        {quizType === 'Timed' && (
          <div className={styles.timer}>
            <Timer onTimeChange={setTime} />
          </div>
        )}
      </div>

      <div className={styles.actionButtons}>
        <div className={styles.caution}>
          <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
          <button className={styles.cancelButton} onClick={handleDeleteQuestion}>Delete Question</button>
        </div>
        <button className={styles.createButton} onClick={handleUpdateQuiz}>Update Quiz</button>
      </div>
    </div>
  );
};

export default UpdateDetails;
