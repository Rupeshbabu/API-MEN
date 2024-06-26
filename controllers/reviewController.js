// eslint-disable-next-line no-unused-vars
const Review = require('../models/reviewModel');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


// exports.getAllReviews = catchAsync(async (req, res, next) => {

//     let filter = {}

//     if (req.params.tourId) filter = { tour: req.params.tourId };

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         result: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

exports.setTourUserIds = (req, res, next) => {
    // ! Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//     // ! Allow nested routes
//     if (!req.body.tour) req.body.tour = req.params.tourId;
//     if (!req.body.user) req.body.users = req.user.id;
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });

//add factory
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.getReview = factory.getOne(Review);
