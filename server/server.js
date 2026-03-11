const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json());

const authRoutes     = require('./routes/auth');
const listingRoutes  = require('./routes/listings');

app.use('/api/auth',     authRoutes);
app.use('/api/listings', listingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WanderHub API is running 🌍' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

//  Database + Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (projectdb)');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
  module.exports = app;
