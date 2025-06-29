// User controller
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const Audit = require('../models/audit');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'create_user', details: `Created user ${email}` });
    }
    res.status(201).json({ ...user, password: undefined });
  } catch (err) {
    console.error('User creation error:', err); // Log the actual error
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await User.update(id, { name, email, password: hashedPassword, role });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'update_user', details: `Updated user ${id}` });
    }
    res.json({ ...updated, password: undefined });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    // Audit log
    await Audit.logEvent({ user_id: user.id, action: 'login', details: `User ${user.email} logged in` });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'delete_user', details: `Deleted user ${id}` });
    }
    res.json({ message: 'User deleted', user: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
