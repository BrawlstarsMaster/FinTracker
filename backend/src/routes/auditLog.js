const express = require('express');
const controller = require('../controllers/auditLogController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();

router.use(auth, admin);
router.get('/', controller.getAll);

module.exports = router; 