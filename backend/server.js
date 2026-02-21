require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbconnect');
const userRoutes = require('./Routes/UserRoutes');
const authRoutes = require('./Routes/AuthAdmin');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
// app.use(cors({origin: `${process.env.FRONTEND_URL}`,credentials: true}));

// const cors = require('cors');

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));


app.use('/api', userRoutes);
app.use('/api', authRoutes);

mongoose.connection.on('error', err => {
  console.log("Mongoose connection error: ", err);
});

mongoose.connection.on('connected', () => {
  console.log("Mongoose connected to DB");
});

const PORT = process.env.PORT || 5000;
// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.listen(PORT, () => {
    connectDB(process.env.DB_URL);
    console.log(`🚀 Orbit Server running on port ${PORT}`);
});