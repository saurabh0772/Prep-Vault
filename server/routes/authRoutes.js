const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

router.post(
  '/register',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  registerUser
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
  ]),
  loginUser
);

router.post('/logout', logoutUser);

// Optional route to check if user is logged in
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({ userId: req.userId });
});

module.exports = router;
