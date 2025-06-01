const express = require('express');
const controller = require('../controllers/profileController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);
router.get('/', controller.getProfile);
router.put('/', controller.updateProfile);
router.put('/password', controller.changePassword);

module.exports = router; 