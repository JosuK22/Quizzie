import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/connection';
import { AuthContext } from '../store/AuthProvider';

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCount, setQuizCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const { user, isLoading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (authLoading) return; // Wait for auth to finish loading
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/quiz`, {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Use token if available
          },
        });
        const quizzesData = response.data;
        setQuizzes(quizzesData);
        setQuizCount(quizzesData.length);
        const totalQuestions = quizzesData.reduce((acc, quiz) => acc + quiz.questions.length, 0);
        setQuestionCount(totalQuestions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [authLoading, user?.token]);

  const deleteQuiz = async (id) => {
    if (authLoading) return; // Wait for auth to finish loading
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Use token if available
        },
      });
      setQuizzes((prevQuizzes) => {
        const updatedQuizzes = prevQuizzes.filter((quiz) => quiz._id !== id);
        setQuizCount(updatedQuizzes.length);
        const totalQuestions = updatedQuizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
        setQuestionCount(totalQuestions);
        return updatedQuizzes;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const addQuiz = (newQuiz) => {
    setQuizzes((prevQuizzes) => {
      const updatedQuizzes = [...prevQuizzes, newQuiz];
      setQuizCount(updatedQuizzes.length);
      const totalQuestions = updatedQuizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
      setQuestionCount(totalQuestions);
      return updatedQuizzes;
    });
  };

  return (
    <QuizContext.Provider value={{ quizzes, loading, error, quizCount, questionCount, deleteQuiz, addQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
