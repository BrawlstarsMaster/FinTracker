const express = require('express');
const controller = require('../controllers/budgetController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/usage', controller.getUsage);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router; 