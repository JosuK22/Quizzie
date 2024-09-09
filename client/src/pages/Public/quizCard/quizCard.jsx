import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Text } from '../../../components/ui';
import VictoryCard from '../victoryCard/victorycard';
import styles from './quizcard.module.css';
import { BACKEND_URL } from '../../../utils/connection'; 

export default function QuizCard({ quiz, onFinish }) {
  // State initialization
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(
    quiz.questions.length > 0 ? String(quiz.questions[0].timer) : '0'
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [hasAttempted, setHasAttempted] = useState(false); 

  const totalQuestions = quiz.questions.length;

  useEffect(() => {
    if (countdown <= 0) {
      handleQuestionTimeout();
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => (Number(prevCountdown) - 1).toString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown, isSubmitted]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        handleQuizSubmission();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentIndex, score, isSubmitted]);

  const updateDatabase = async () => {
    if (selectedOption === null) {
      return; 
    }

    try {
      setLoading(true);
      await fetch(`${BACKEND_URL}/api/v1/quiz/${quiz._id}/update-attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIndex: currentIndex,
          selectedOptionIndex: selectedOption,
        }),
      });
    } catch (err) {
      console.error('Failed to update attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionTimeout = async () => {
    if (!hasAttempted) {
      const correctOption = quiz.questions[currentIndex].correct_option;
      let newScore = score;
      if (selectedOption === correctOption) {
        newScore += 1;
        setScore(newScore);
      }
      await updateDatabase();
      setHasAttempted(true); 

      if (currentIndex === totalQuestions - 1) {
        localStorage.setItem(`quiz_${quiz._id}_score`, newScore);
        localStorage.setItem(`quiz_${quiz._id}_submitted`, 'true');
        setIsSubmitted(true);
        onFinish(newScore); // Notify parent of completion
        return;
      }
    }

    moveToNextQuestion();
  };

  const moveToNextQuestion = async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setCountdown(String(quiz.questions[currentIndex + 1].timer));
      setSelectedOption(null);
      setHasAttempted(false); 
    } else {
      await handleQuizSubmission(); 
    }
  };

  const handleOptionClick = (index) => {
    if (selectedOption !== null && hasAttempted) {
      return;
    }

    setSelectedOption(index);
  };

  const handleButtonClick = async () => {
    if (isSubmitted) {
      return;
    }

    if (selectedOption !== null && !hasAttempted) {
      const correctOption = quiz.questions[currentIndex].correct_option;
      let newScore = score;
      if (selectedOption === correctOption) {
        newScore += 1;
        setScore(newScore);
      }
      await updateDatabase();
      setHasAttempted(true); 

      if (currentIndex === totalQuestions - 1) {
        localStorage.setItem(`quiz_${quiz._id}_score`, newScore);
        localStorage.setItem(`quiz_${quiz._id}_submitted`, 'true');
        setIsSubmitted(true);
        onFinish(newScore); // Notify parent of completion
        return;
      }
    }

    await moveToNextQuestion(); 
  };

  const handleQuizSubmission = async () => {
    let finalScore = score;

    if (selectedOption !== null && !hasAttempted) {
      const correctOption = quiz.questions[currentIndex].correct_option;
      if (selectedOption === correctOption) {
        finalScore += 1;
      }
      await updateDatabase();
    }

    setScore(finalScore);
    localStorage.setItem(`quiz_${quiz._id}_submitted`, 'true');
    localStorage.setItem(`quiz_${quiz._id}_score`, finalScore);
    setIsSubmitted(true);
    onFinish(finalScore); // Notify parent of completion
  };

  const currentQuestion = quiz.questions[currentIndex];
  const { question_text, question_number, options } = currentQuestion || {};

  const formattedQuestionNumber = question_number
    ? `${String(question_number).padStart(2, '0')}/${String(totalQuestions).padStart(2, '0')}`
    : 'N/A';

  const timerDisplay = countdown > 0
    ? `00 : ${String(countdown).padStart(2, '0')} sec`
    : ' ';

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div className={styles.questionNumber}>
          <Text step={5} weight="700">
            {formattedQuestionNumber}
          </Text>
        </div>
        <div className={styles.timer}>
          <Text step={5} color="red" weight="700">
            {timerDisplay}
          </Text>
        </div>
      </div>

      <div className={styles.body}>
        
        <div className={styles.question}>
          <Text step={6} weight="700">
            {question_text || 'No question text'}
          </Text>
        </div>

        <div className={styles.option_content}>
          {options && options.length > 0 ? (
            options.map((option, index) => {
              return (
                <div
                  key={index}
                  className={`${styles.option_item} ${
                    selectedOption === index ? styles.selectedOption : ''
                  }`}
                  onClick={() => handleOptionClick(index)}
                >
                  {option.image_url && (
                    <img
                      src={option.image_url}
                      alt={`Option ${index + 1}`}
                      className={styles.optionImage}
                    />
                  )}
                  {option.text && (
                    <div className={styles.optionText}>
                      {option.text}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className={styles.option_item}>No options available</div>
          )}
        </div>


      </div>
      <div className={styles.buttons}>
          <button
            className={styles.continueButton}
            onClick={handleButtonClick}
            disabled={loading} 
          >
            {currentIndex >= totalQuestions - 1 ? 'Submit' : 'NEXT'}
          </button>
        </div>
      
    </div>
  );
}

QuizCard.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question_text: PropTypes.string.isRequired,
        question_number: PropTypes.number.isRequired,
        // timer: PropTypes.string.isRequired, 
        options: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string,
            image_url: PropTypes.string,
          })
        ),
        correct_option: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onFinish: PropTypes.func.isRequired,
};
