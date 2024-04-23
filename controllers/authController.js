const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) =>{
  const token = signToken(user.id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  // const token = signToken(newUser._id);
  // jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN
  // });

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2. Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  // const correct = user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3. If everything ok, send token to client
  createSendToken(user, 201, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(new AppError('Your are not logged in! Please log and get access', 401));
  }

  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The User belonging to this token does no longer exist', 401));
  }

  // 4. Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please login again', 401));
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //roles ['admin', 'lead-guide]. role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };

exports.forgotPassword = async (req, res, next) => {
  // 1. Get user based on POSTED Email
    const user = await User.findOne({email: req.body.email});
    if(!user){
      return next(new AppError('There is no user with email address.', 404));
    }
  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});

  // 3. Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a UPDATE request with your new password confirm to : ${resetURL}.\n If you didn't your password, please ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Password Reset token (valid for 10min)',
        message
      });
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
  
  
}
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1.  Get User based on Token
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({passwordResetToken: hashToken, passwordResetExpires: {$gt: Date.now()}});


  // 2. If token has not expired, and there is user, set the new password
  if(!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3. Update changePasswordAt property for the user


  // 4. Log the user in, send JWT
  createSendToken(user, 201, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
}); 

exports.updatePassword = catchAsync(async (req, res, next) =>{
  // 1. Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log(user);
  
    // 2. Check if POSTed current password is correct
  if(!user.correctPassword(req.body.passwordConfirm, user.password)){
    return next(new AppError('Your current password is worng', 401));
  }

  // 3. If so, update Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
    // User.findByIDAndUpdate will NOT work as intended!

  // 4. Log user in, send JWT
  createSendToken(user, 201, res);

});