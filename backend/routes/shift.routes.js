const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shift.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, shiftController.getAll);
router.get('/:id', verifyToken, shiftController.getById);
router.post('/', verifyToken, shiftController.create);
router.put('/:id', verifyToken, shiftController.update);
router.delete('/:id', verifyToken, shiftController.delete);

module.exports = router;

