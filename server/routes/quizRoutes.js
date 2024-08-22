const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

// Create a new quiz
router.post('/', quizController.createQuiz);

// Update an existing quiz
router.patch('/:id', quizController.updateQuiz);

// Delete a quiz
router.delete('/:id', quizController.deleteQuiz);

// Get all quizzes
router.get('/', quizController.getAllQuizzes);

// Get a quiz by ID
router.get('/:id', quizController.getQuizById);

module.exports = router;
