const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err))

app.get('/', (req, res) => res.send('The Garage Marketplace API'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// const app = express();
// import mongoose from 'mongoose';

// const marketRouter = require('../src/controllers/auth.js');

// mongoose.connect(process.env.MONGODB_URI);

// mongoose.connection.on('connected', () => {
//   console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
// });

// app.use(express.json());

// // Routes go here
// app.use('/TheGarage', marketRouter)

// app.listen(3000, () => {
//   console.log('The express app is ready!');
// });
