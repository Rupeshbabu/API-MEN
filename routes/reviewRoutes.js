const express = require('express');
const { createReview, getAllReviews, deleteReview, updateReview, setTourUserIds, getReview } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect); //! only login user will add review. below routes it will apply middleware

router.route('/').get(getAllReviews).post(restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').get(getReview).patch(restrictTo('user', 'admin'), updateReview).delete(restrictTo('user', 'admin'), deleteReview);
module.exports = router;
