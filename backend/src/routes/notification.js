const express = require('express');
const controller = require('../controllers/notificationController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();

router.use(auth);
router.get('/', controller.getAll);
router.put('/:id/read', controller.markRead);
router.delete('/:id', controller.remove);
router.post('/fetch-finance-news', controller.fetchFinanceNews);

module.exports = router; 