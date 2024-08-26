const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError('Please login to access this route', 401);
  }

  const token = authorization.split(' ')[1];

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User does not exist!', 401);
  }

  req.user = user;

  next();
});
