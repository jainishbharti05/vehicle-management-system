const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');
const { serviceValidationRules } = require('../middleware/validators');
const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Define service routes here
router.get('/', authenticateToken, servicesController.getAllServices); // All authenticated users can view
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), serviceValidationRules, handleValidation, servicesController.createService); // Only admin/manager
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), serviceValidationRules, handleValidation, servicesController.updateService); // Only admin/manager
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'manager'), servicesController.deleteService); // Only admin/manager

module.exports = router;
