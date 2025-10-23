const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, departmentController.getAll);
router.get('/:id', verifyToken, departmentController.getById);
router.post('/', verifyToken, departmentController.create);
router.put('/:id', verifyToken, departmentController.update);
router.delete('/:id', verifyToken, departmentController.delete);

module.exports = router;

