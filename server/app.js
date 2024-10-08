const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const quizRouter = require('./routes/quizRoutes');

const AppError = require('./utils/AppError');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send('Welcome to My server');
});

app.get('/api/v1/', (req, res) => {
  return res.status(200).send('Explore My server version 2.0.');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/quiz', quizRouter);


app.all('*', (req, res, next) => {
  throw new AppError('Route does not exists', 404);
});

app.use(globalErrorHandler);

module.exports = app;
