// Express-validator rules for user endpoints
const { body } = require('express-validator');

exports.userValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').notEmpty().withMessage('Role is required'),
];

exports.loginValidationRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.serviceValidationRules = [
  body('name').notEmpty().withMessage('Service name is required'),
  body('description').optional().isString(),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('mechanic_id').isInt().withMessage('Mechanic ID is required and must be an integer'),
  body('status').optional().isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
  body('duration_estimate').isInt({ gt: 0 }).withMessage('Duration estimate (minutes) is required and must be positive'),
  body('vehicle_id').isInt().withMessage('Vehicle ID is required and must be an integer'),
];

exports.vehicleValidationRules = [
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1886 }).withMessage('Year must be a valid number'),
  body('vin').notEmpty().withMessage('VIN is required'),
];

exports.auditLogValidationRules = [
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('action').notEmpty().withMessage('Action is required'),
  body('details').optional().isString(),
];
