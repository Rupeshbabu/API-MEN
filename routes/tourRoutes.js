const express = require('express');
const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getTourWithin,
  getDistance
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// router.param('id', checkID);

//Create a checkBody middleware
//Check if body contains the name and price property
//If not, send back 400 (bad request)
//Add it to the post handler stack

router.use('/:tourId/reviews', reviewRoutes)

router.route('/top').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getTourWithin);
// tours-within?distance=233&center=-40,45&unit=mi
// tours-within/233/center/-40.45/unit/mi

router.route('/distance/:latlng/unit/:unit').get(getDistance);

router.route('/').get(getAllTours).post(protect, restrictTo('admin', 'lead-guide'), createTour);
router.route('/:id').get(getTour).patch(protect, restrictTo('admin', 'lead-guide'), updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// Nested route
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);


module.exports = router;
