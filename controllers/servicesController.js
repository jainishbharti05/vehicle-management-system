// Service controller
const Service = require('../models/service');
const Audit = require('../models/audit');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

exports.createService = async (req, res) => {
  const { name, description, price, mechanic_id, status, duration_estimate, vehicle_id } = req.body;
  if (!name || typeof price !== 'number' || !mechanic_id || !duration_estimate || !vehicle_id) {
    return res.status(400).json({ error: 'Name, price, mechanic_id, duration_estimate, and vehicle_id are required.' });
  }
  try {
    const newService = await Service.create({ name, description, price, mechanic_id, status: status || 'SCHEDULED', duration_estimate, vehicle_id });
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'create_service', details: `Created service ${name}` });
    }
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, mechanic_id, status, duration_estimate, vehicle_id } = req.body;
  if (!name || typeof price !== 'number' || !mechanic_id || !duration_estimate || !vehicle_id) {
    return res.status(400).json({ error: 'Name, price, mechanic_id, duration_estimate, and vehicle_id are required.' });
  }
  try {
    const updated = await Service.update(id, { name, description, price, mechanic_id, status, duration_estimate, vehicle_id });
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'update_service', details: `Updated service ${id}` });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Service.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'delete_service', details: `Deleted service ${id}` });
    }
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
