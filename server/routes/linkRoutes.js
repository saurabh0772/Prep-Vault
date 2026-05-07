const express = require('express');
const {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
} = require('../controllers/linkController');
const { verifyToken } = require('../middleware/verifyToken');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');

const router = express.Router();

router.route('/')
  .get(verifyToken, getLinks)
  .post(
    verifyToken,
    validate([
      body('label').notEmpty().withMessage('Label is required'),
      body('url').isURL().withMessage('Valid URL is required'),
    ]),
    createLink
  );

router.route('/:id')
  .put(verifyToken, updateLink)
  .delete(verifyToken, deleteLink);

module.exports = router;
