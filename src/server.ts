import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import studentRoutes from './routes/studentRoutes';
import cookieParser from 'cookie-parser';
import { AuthUserByToken } from './utils/auth';
dotenv.config();  // Load environment variables

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/users', userRoutes);

app.use('/students', studentRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
