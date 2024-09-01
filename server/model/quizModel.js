const mongoose = require('mongoose');
const { Schema } = mongoose;

// URL validation function
const isValidUrl = (url) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-zA-Z0-9$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+)' + // domain name
    '|localhost|' + // localhost
    '((\\d{1,3}\\.){3}\\d{1,3})' + // IP address (v4)
    '|([a-fA-F]{1,4}:){7}[a-fA-F]{1,4})' + // IP address (v6)
    '(\\:\\d+)?' + // port
    '(\\/[-a-zA-Z0-9@:%_\\+~#=]*)*' + // path
    '(\\?[;&a-zA-Z0-9%_\\+~#=]*)?' + // query string
    '(\\#[-a-zA-Z0-9_]*)?$',
    'i' // case-insensitive
  );
  return urlPattern.test(url);
};

const OptionSchema = new Schema({
  text: {
    type: String,
    trim: true,
    required: function() { return this.optionType === 'text' || this.optionType === 'textImage'; }
  },
  image_url: {
    type: String,
    trim: true,
    required: function() { return this.optionType === 'image' || this.optionType === 'textImage'; },
    validate: {
      validator: function(value) {
        return !value || isValidUrl(value); // Validate URL or allow empty string
      },
      message: 'Invalid URL format'
    }
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
    // validate: {
    //   validator: function(v) {
    //     return this.quiz_type === 'Q&A' ? v !== null && v < this.options.length : true;
    //   },
    //   message: props => `Correct option index must be between 0 and ${this.options.length - 1}.`,
    // },
  },
  attempts: {
    type: Number,
    default: 0,
  },
  correct_attempts: {
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
    enum: ['Q&A', 'Poll'],
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
