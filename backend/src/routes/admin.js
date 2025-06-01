const express = require('express');
const { listUsers, generateReports, deactivateUser, reactivateUser, listCategories, addCategory, removeCategory } = require('../controllers/adminController');

console.log('Debug: adminController import', { listUsers, generateReports, deactivateUser, reactivateUser, listCategories, addCategory, removeCategory });

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();

router.use(auth, admin);
router.get('/users', listUsers);
router.get('/reports', generateReports);
router.patch('/users/:id/deactivate', deactivateUser);
router.patch('/users/:id/reactivate', reactivateUser);
router.get('/categories', listCategories);
router.post('/categories', addCategory);
router.delete('/categories/:id', removeCategory);

module.exports = router; 