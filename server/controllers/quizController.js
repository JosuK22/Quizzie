const Quiz = require('../model/quizModel');

// Helper function to validate the options of a question
const validateOptions = (options, correct_option) => {
  return options.length >= 2 && options.length <= 4 &&
         correct_option >= 0 && correct_option < options.length;
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { name, type, questions } = req.body;
    const newQuiz = new Quiz({ name, type, questions });
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

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
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
