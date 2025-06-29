// Load environment variables based on environment
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

// Remove manual JWT secret override, now handled by .env files
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Modular routes
app.use('/users', require('./routes/users'));
app.use('/vehicles', require('./routes/vehicles'));
app.use('/services', require('./routes/services'));
app.use('/audit', require('./routes/audit'));

app.get('/', (req, res) => {
  res.send('Vehicle Service Management API (Express)');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
