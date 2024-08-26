const express = require('express');
const mongoose = require('mongoose');
const plateRoutes = require('./routes/platesRoutes.js');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/car_plates')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', plateRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});