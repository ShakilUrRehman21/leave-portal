const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("MongoDB URI is not defined. Please add MONGO_URI to backend/.env to connect.");
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'leave_management',
            serverSelectionTimeoutMS: 15000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.warn('Backend server remains active, but database operations will fail until MONGO_URI is updated.');
    }
};

module.exports = connectDB;
