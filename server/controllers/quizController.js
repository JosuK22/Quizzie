const Quiz = require('../model/quizModel');

const validateOptions = (options, correct_option) => {
  return options.length >= 2 && options.length <= 4 &&
         correct_option >= 0 && correct_option < options.length;
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { name, type, questions } = req.body;
    const userId = req.user._id; // Assuming you have the user's ID available in req.user

    const newQuiz = new Quiz({ name, type, questions, createdBy: userId });
    await newQuiz.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing quiz
exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Update only allowed fields
    const allowedFields = ['questions'];
    const updateFields = Object.keys(updates).filter(field => allowedFields.includes(field));
    
    updateFields.forEach(field => {
      if (field === 'questions') {
        // Validate and update questions
        updates.questions.forEach((question, index) => {
          const originalQuestion = quiz.questions[index];
          if (!originalQuestion) return;

          // Check if options length is correct and options are not changed
          if (question.options) {
            if (question.options.length !== originalQuestion.options.length) {
              throw new Error(`Cannot change number of options for question ${index + 1}`);
            }

            question.options.forEach((option, optionIndex) => {
              if (originalQuestion.options[optionIndex]) {
                originalQuestion.options[optionIndex].text = option.text;
                originalQuestion.options[optionIndex].image_url = option.image_url;
              }
            });
          }

          // Check and update timer
          if (question.timer !== undefined) {
            originalQuestion.timer = question.timer;
          }

          // Other question updates
          originalQuestion.question_text = question.question_text || originalQuestion.question_text;
        });
      }
    });

    await quiz.save();
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Quiz.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Quiz not found' });

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all quizzes created by the authenticated user
exports.getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have the user's ID available in req.user
    const quizzes = await Quiz.find({ createdBy: userId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get quizzes by a specific user
exports.getUserQuizzes = async (req, res) => {
  const { userId } = req.params;
  try {
    const quizzes = await Quiz.find({ createdBy: userId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Increment impressions count
exports.incrementImpressions = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    quiz.impressions += 1;
    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller method to update attempts and correct_attempts
exports.updateAttempts = async (req, res) => {
  const { id } = req.params;
  const { questionIndex, selectedOptionIndex } = req.body;

  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const question = quiz.questions[questionIndex];
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment attempts
    question.attempts += 1;

    // Check if the selected option is correct
    if (selectedOptionIndex === question.correct_option) {
      question.correct_attempts += 1;
    }

    await quiz.save();
    res.status(200).json({ message: 'Attempts updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};