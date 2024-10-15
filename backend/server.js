import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js'; // Ensure this is correctly importing your routes

dotenv.config();

const app = express(); // Initialize the app

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define your routes AFTER the app is initialized
app.use('/api/users', userRoutes); // Use user routes here

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to SafeSteps API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});