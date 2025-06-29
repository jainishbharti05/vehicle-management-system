const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');
const { auditLogValidationRules } = require('../middleware/validators');
const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Define audit log routes here
router.get('/', authenticateToken, authorizeRoles('admin'), auditController.getAllLogs); // Only admin can view logs
router.post('/', authenticateToken, auditLogValidationRules, handleValidation, auditController.logEvent); // Any authenticated user can log event
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditController.deleteLog); // Only admin can delete

module.exports = router;
