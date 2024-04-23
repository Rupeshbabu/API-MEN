const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('this route is not for password updates. Please use  /update-Password', 400));
  }
  // 2. Filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3. update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
        user: updateUser
    }
  });
});

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '',
    data: null,
  });
};
