const express = require('express');
const { createUser, deleteUser, getAllUsers, getUser, updateUser, updateMe, deleteMe, getMe } = require('../controllers/userController');
const { signup, login, forgotPassword, resetPassword, updatePassword, protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// below every API before calls , we need to check user "protect". for that declare middleware
// Protect all routes after this middleware
router.use(protect);

router.patch('/update-password', updatePassword);
router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);
router.get('/me', getMe, getUser);

router.use(restrictTo('admin')); // ! restrict for except admin

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


module.exports = router;
