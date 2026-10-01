const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Connect to database resiliently for Serverless
if (mongoose.connection.readyState === 0) {
    connectDB();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

// Fallback aliases in case client baseURL omits /api
app.use('/auth', authRoutes);
app.use('/leaves', leaveRoutes);

// Root Health Check API Route
app.get('/', (req, res) => {
    res.send('LeavePortal Server is running!');
});

app.get('/api', (req, res) => {
    res.send('LeavePortal API is running...');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the Express API for Vercel
module.exports = app;
