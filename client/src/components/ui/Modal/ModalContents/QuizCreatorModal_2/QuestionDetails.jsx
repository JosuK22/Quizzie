import { useState, useEffect, useContext } from 'react';
import Text from '../../../Text/Text';
import Timer from './Timer/timer';
import OptionsContainer from './Options/options';
import toast, { Toaster } from 'react-hot-toast';
import { BACKEND_URL } from '../../../../../utils/connection';
import { AuthContext } from '../../../../../store/AuthProvider';
import { useQuiz } from '../../../../../store/QuizProvider';
import QuizPublished from '../QuizCreatorModal_3/QuizPublished'; 
import styles from './questiondetails.module.css';

const QuestionDetails = ({ toggleModal, quizType, quizName, setModalContent }) => {
  const [time, setTime] = useState(null);
  const { user } = useContext(AuthContext);
  const { addQuiz } = useQuiz(); 
  const [questionsData, setQuestionsData] = useState([
    { question: '', options: [{ text: '', image_url: '' }, { text: '', image_url: '' }], optionType: 'text', selectedOption: null, timer: null }
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [errorState, setErrorState] = useState({
    questionError: false,
    optionsError: false,
    optionSelectedError: false
  });

  useEffect(() => {
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
    if (updatedQuestions[selectedQuestionIndex].options.length < 5) {
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
    // Ensure at least two options remain
    if (updatedQuestions[selectedQuestionIndex].options.length > 2) {
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
    if (questionsData.length < 5) {
      setQuestionsData([
        ...questionsData,
        { question: '', options: [{ text: '', image_url: '' }, { text: '', image_url: '' }], optionType: 'text', selectedOption: null, timer: time }
      ]);
      setSelectedQuestionIndex(questionsData.length);
    }
  };

  const handleCancel = () => {
    setQuestionsData([
      { question: '', options: [{ text: '', image_url: '' }, { text: '', image_url: '' }], optionType: 'text', selectedOption: null, timer: time }
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
      const allOptionsFilled = q.options.every(option => {
        const isTextValid = option.text.trim();
        const isImageValid = option.image_url ? isValidUrl(option.image_url) : true; // Validate URL
        const isAdditionalUrlValid = q.optionType === 'textImage' ? (option.additional_url ? isValidUrl(option.additional_url) : true) : true; // Validate URL if applicable
        
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
  
      // Check if correct_option is required based on quizType
      if (quizType !== 'Poll') {
        const isOptionSelected = q.selectedOption !== null &&
                                 q.selectedOption >= 0 &&
                                 q.selectedOption < q.options.length;
        if (!isOptionSelected) {
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

  const handleCreateQuiz = async () => {
    if (validateQuiz()) {
      const quizDetails = {
        name: quizName,
        type: quizType,
        questions: questionsData.map((q, index) => ({
          question_number: index + 1,
          question_text: q.question,
          option_type: q.optionType,
          options: q.options.map(option => ({
            text: option.text,
            image_url: option.image_url,
            additional_url: option.additional_url || ''
          })),
          // Conditionally include correct_option
          ...(quizType !== 'Poll' ? { correct_option: q.selectedOption } : {}),
          timer: quizType === 'Q&A' ? (q.timer === null ? null : Number(q.timer)) : null
        }))
      };
  
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(quizDetails),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          toast.success('Quiz created successfully!');
          console.log('Quiz Created:', result);
          addQuiz(result);
          setModalContent(
            <QuizPublished
              toggleModal={toggleModal}
              quizId={result._id}
            />
          );
  
        } else {
          toast.error(`Error: ${result.error}`);
        }
      } catch (error) {
        toast.error('An error occurred while creating the quiz.');
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
        value={questionsData[selectedQuestionIndex]?.question || ''}
        placeholder="Enter your question"
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

export default QuestionDetails;
