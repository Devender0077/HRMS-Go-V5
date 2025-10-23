const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, branchController.getAll);
router.get('/:id', verifyToken, branchController.getById);
router.post('/', verifyToken, branchController.create);
router.put('/:id', verifyToken, branchController.update);
router.delete('/:id', verifyToken, branchController.delete);

module.exports = router;

