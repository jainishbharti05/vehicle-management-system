const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehiclesController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');
const { vehicleValidationRules } = require('../middleware/validators');
const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Define vehicle routes here
router.get('/', authenticateToken, vehiclesController.getAllVehicles); // All authenticated users can view
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), vehicleValidationRules, handleValidation, vehiclesController.createVehicle); // Only admin/manager
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), vehicleValidationRules, handleValidation, vehiclesController.updateVehicle); // Only admin/manager
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'manager'), vehiclesController.deleteVehicle); // Only admin/manager

module.exports = router;
