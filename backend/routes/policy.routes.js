const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, policyController.getAll);
router.get('/:id', verifyToken, policyController.getById);
router.post('/', verifyToken, policyController.create);
router.put('/:id', verifyToken, policyController.update);
router.delete('/:id', verifyToken, policyController.delete);

module.exports = router;

