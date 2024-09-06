import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/connection';
import { AuthContext } from '../store/AuthProvider';

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCount, setQuizCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
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

        // Filter for trending quizzes
        const trending = quizzesData.filter(quiz => quiz.trending);
        setTrendingQuizzes(trending);

        // Update counts and impressions
        setQuizCount(quizzesData.length);
        const totalQuestions = quizzesData.reduce((acc, quiz) => acc + quiz.questions.length, 0);
        setQuestionCount(totalQuestions);

        const impressions = quizzesData.reduce((acc, quiz) => acc + quiz.impressions, 0);
        setTotalImpressions(impressions);
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

        // Recalculate total impressions
        const totalImpressions = updatedQuizzes.reduce((acc, quiz) => acc + quiz.impressions, 0);
        setTotalImpressions(totalImpressions);

        // Update trending quizzes
        const trending = updatedQuizzes.filter(quiz => quiz.trending);
        setTrendingQuizzes(trending);

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

      // Recalculate total impressions
      const impressions = updatedQuizzes.reduce((acc, quiz) => acc + quiz.impressions, 0);
      setTotalImpressions(impressions);

      // Update trending quizzes
      const trending = updatedQuizzes.filter(quiz => quiz.trending);
      setTrendingQuizzes(trending);

      return updatedQuizzes;
    });
  };
  

  return (
    <QuizContext.Provider value={{ quizzes, trendingQuizzes, loading, error, quizCount, questionCount, totalImpressions, deleteQuiz, addQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
