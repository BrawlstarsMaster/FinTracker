const express = require('express');
const auth = require('../middlewares/auth');
const categoriesController = require('../controllers/categoriesController');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/profile', require('./profile'));
router.use('/admin', require('./admin'));
router.use('/budgets', require('./budget'));
router.use('/notifications', require('./notification'));
router.use('/recurring', require('./recurringTransaction'));
router.use('/goals', require('./goal'));
router.use('/transactions', require('./transaction'));
router.use('/categories', auth, categoriesController);

module.exports = router; 