import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Text } from '../../../components/ui';
import VictoryCard from '../victoryCard/victorycard';
import styles from './quizcard.module.css';
import { BACKEND_URL } from '../../../utils/connection'; // Add this import

export default function Card({ quiz }) {
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div>No quiz data available</div>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(
    quiz.questions.length > 0 ? parseInt(quiz.questions[0].timer, 10) : 0
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const totalQuestions = quiz.questions.length;

  useEffect(() => {
    if (isSubmitted) {
      return;
    }

    if (countdown <= 0) {
      handleQuestionTimeout();
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown, isSubmitted]);

  const handleQuestionTimeout = async () => {
    if (selectedOption !== null) {
      const correctOption = quiz.questions[currentIndex].correct_option;
      if (selectedOption === correctOption) {
        setScore((prevScore) => prevScore + 1);
      }
    }

    // Update attempts and correct_attempts on the server
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

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setCountdown(parseInt(quiz.questions[currentIndex + 1].timer, 10));
      setSelectedOption(null);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleButtonClick = () => {
    if (isSubmitted) {
      return;
    }
    handleQuestionTimeout();
  };

  if (isSubmitted) {
    return <VictoryCard score={score} totalQuestions={totalQuestions} />;
  }

  const currentQuestion = quiz.questions[currentIndex];
  const { question_text, question_number, options } = currentQuestion || {};

  const formattedQuestionNumber = question_number
    ? `${String(question_number).padStart(2, '0')}/${String(totalQuestions).padStart(2, '0')}`
    : 'N/A';

  const timerDisplay = countdown > 0
    ? `00 : ${String(countdown).padStart(2, '0')} sec`
    : ' ';

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

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
          <Text step={4} weight="700">
            {question_text || 'No question text'}
          </Text>
        </div>
        <div className={styles.option_grid}>
          {options && options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={index}
                className={`${styles.option_item} ${
                  selectedOption === index ? styles.selectedOption : ''
                }`}
                onClick={() => handleOptionClick(index)}
              >
                {option.text || `Option ${index + 1}`}
              </div>
            ))
          ) : (
            <div className={styles.option_item}>No options available</div>
          )}
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.continueButton}
            onClick={handleButtonClick}
            disabled={loading} // Disable button while loading
          >
            {currentIndex >= totalQuestions - 1 ? 'Submit' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Ensure quiz ID is passed
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question_text: PropTypes.string.isRequired,
        question_number: PropTypes.number.isRequired,
        timer: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
          })
        ),
        correct_option: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
