// Audit log controller
const Audit = require('../models/audit');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Audit.getAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

exports.logEvent = async (req, res) => {
  try {
    const { user_id, action, details } = req.body;
    if (!user_id || !action) {
      return res.status(400).json({ error: 'user_id and action are required' });
    }
    const log = await Audit.logEvent({ user_id, action, details });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log event' });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Audit.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json({ message: 'Log deleted', log: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete log' });
  }
};
