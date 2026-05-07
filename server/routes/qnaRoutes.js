const express = require('express');
const {
  getQnAs,
  createQnA,
  updateQnA,
  deleteQnA,
} = require('../controllers/qnaController');
const { verifyToken } = require('../middleware/verifyToken');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');

const router = express.Router();

router.route('/')
  .get(verifyToken, getQnAs)
  .post(
    verifyToken,
    validate([
      body('question').notEmpty().withMessage('Question is required'),
      body('answer').notEmpty().withMessage('Answer is required'),
      body('topic').notEmpty().withMessage('Topic is required'),
    ]),
    createQnA
  );

router.route('/:id')
  .put(verifyToken, updateQnA)
  .delete(verifyToken, deleteQnA);

module.exports = router;
