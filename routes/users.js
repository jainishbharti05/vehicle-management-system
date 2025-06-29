const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { userValidationRules, loginValidationRules } = require('../middleware/validators');
const { validationResult } = require('express-validator');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

// Validation error handler
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Define user routes here
router.get('/', authenticateToken, authorizeRoles('admin'), usersController.getAllUsers);
router.post('/', userValidationRules, handleValidation, usersController.createUser); // Create user
router.put('/:id', authenticateToken, authorizeRoles('admin'), userValidationRules, handleValidation, usersController.updateUser); // Update user
router.delete('/:id', authenticateToken, authorizeRoles('admin'), usersController.deleteUser); // Delete user
router.post('/login', loginValidationRules, handleValidation, usersController.login); // User login

module.exports = router;
