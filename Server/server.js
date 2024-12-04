const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const authRoutes = require('./routes/auth')


dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Use auth route
app.use('/api/auth', authRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.get('/', (req, res) => res.send('The Garage Marketplace API'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))