// Vehicle controller
const Vehicle = require('../models/vehicle');
const Audit = require('../models/audit');

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.getAll();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

exports.createVehicle = async (req, res) => {
  const { make, model, year, vin, owner_id } = req.body;
  if (!make || !model || !year || !vin || !owner_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    // Enforce unique VIN
    const existing = await Vehicle.findByVIN(vin);
    if (existing) {
      return res.status(400).json({ error: 'A vehicle with this VIN already exists.' });
    }
    const newVehicle = await Vehicle.create({ make, model, year, vin, owner_id });
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'create_vehicle', details: `Created vehicle VIN ${vin}` });
    }
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
};

exports.updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { make, model, year, vin, owner_id } = req.body;
  if (!make || !model || !year || !vin || !owner_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const updated = await Vehicle.update(id, { make, model, year, vin, owner_id });
    if (!updated) return res.status(404).json({ error: 'Vehicle not found' });
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'update_vehicle', details: `Updated vehicle ${id}` });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Vehicle.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Vehicle not found' });
    // Audit log
    if (req.user) {
      await Audit.logEvent({ user_id: req.user.id, action: 'delete_vehicle', details: `Deleted vehicle ${id}` });
    }
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};
