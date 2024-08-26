const express = require('express');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes that do not require authentication
router.get('/:id', quizController.getQuizById);
router.get('/user/:userId', quizController.getUserQuizzes);

// Apply authentication middleware to routes that require it
router.use(authMiddleware.protect);

// Create a new quiz
router.post('/', quizController.createQuiz);

// Update an existing quiz
router.patch('/:id', quizController.updateQuiz);

// Delete a quiz
router.delete('/:id', quizController.deleteQuiz);

// Get all quizzes created by the authenticated user
router.get('/', quizController.getAllQuizzes);

module.exports = router;
