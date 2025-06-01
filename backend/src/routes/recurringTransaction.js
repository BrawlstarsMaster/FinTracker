const express = require('express');
const controller = require('../controllers/recurringTransactionController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/trigger', controller.triggerDue);

module.exports = router; 