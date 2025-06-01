const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/authController');
const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], controller.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], controller.login);

// Password reset (template)
router.post('/reset', controller.resetPassword);

module.exports = router; 