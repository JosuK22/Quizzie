const mongoose = require('mongoose');

const { Schema } = mongoose;

const OptionSchema = new Schema({
  text: {
    type: String,
    trim: true,
  },
  image_url: {
    type: String,
    trim: true,
  },
  attempt_count: {
    type: Number,
    default: 0,  // Initialize attempt_count to 0
  },
}, { _id: false });

const QuestionSchema = new Schema({
  question_number: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  question_text: {
    type: String,
    required: true,
    trim: true,
  },
  option_type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'textImage'],
  },
  options: {
    type: [OptionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 4;
      },
      message: props => `A question must have between 2 to 4 options. Currently has ${props.value.length} options.`,
    },
  },
  correct_option: {
    type: Number,
    min: 0,
    validate: {
      validator: function(v) {
        return this.quiz_type === 'Q&A' ? v !== null && v < this.options.length : true;
      },
      message: props => `Correct option index must be between 0 and ${this.options.length - 1}.`,
    },
  },
  attempts: {
    type: Number,
    default: 0,
  },
  correct_attempts:{
    type: Number,
    default: 0,
  },
  timer: {
    type: Number,
    default: null,
  },
}, { _id: false });

const QuizSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Q&A', 'Poll Type'],
  },
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 1 && v.length <= 5;
      },
      message: props => `A quiz must have between 1 to 5 questions. Currently has ${props.value.length} questions.`,
    },
  },
  impressions: {
    type: Number,
    default: 0,
  },
  trending: {
    type: Boolean,
    default: false,
  },
  sharedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Middleware to set quiz_type in questions before saving
QuizSchema.pre('save', function(next) {
  this.questions.forEach(question => {
    question.quiz_type = this.type;
  });

  // Update trending status based on impressions
  if (this.impressions > 10) {
    this.trending = true;
  } else {
    this.trending = false;
  }

  next();
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
