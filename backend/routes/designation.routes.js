const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designation.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, designationController.getAll);
router.get('/:id', verifyToken, designationController.getById);
router.post('/', verifyToken, designationController.create);
router.put('/:id', verifyToken, designationController.update);
router.delete('/:id', verifyToken, designationController.delete);

module.exports = router;

