const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SERCET, {
    expiresIn: process.env.JWT_EXPIRES_IN.toString()
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!'));
  }
  // 2. check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password!'));
  }

  // 3. If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});
