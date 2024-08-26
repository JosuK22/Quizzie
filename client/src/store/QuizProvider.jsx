import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/connection';
import { AuthContext } from '../store/AuthProvider';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/quiz`, {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Ensure token is set here
        },
      });
      setQuizzes(response.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err.response ? err.response.data : err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchQuizzes();
    }
  }, [user]);

  const addQuiz = (newQuiz) => {
    setQuizzes((prevQuizzes) => [...prevQuizzes, newQuiz]);
  };

  const deleteQuiz = (id) => {
    setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== id));
  };

  const quizCount = quizzes.length;
  const questionCount = quizzes.reduce((total, quiz) => total + quiz.questions.length, 0);

  return (
    <QuizContext.Provider value={{ quizzes, loading, error, fetchQuizzes, addQuiz, deleteQuiz, quizCount, questionCount }}>
      {children}
    </QuizContext.Provider>
  );
};

