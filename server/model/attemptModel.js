const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  answers: [{
    question_number: {
      type: Number,
      required: true,
    },
    selectedOption: {
      type: Number,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  score: {
    type: Number,
    default: 0,
  },
  finishedAt: {
    type: Date,
    default: Date.now,
  },
  impressions: {
    type: Number,
    default: 0,
  }
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
