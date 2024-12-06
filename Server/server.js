const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const listingRoutes = require('./routes/listings')
const userRoutes = require('./routes/users')
const messageRoutes = require('./routes/messages')
const path = require('path')


dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Use auth route
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.get('/', (req, res) => res.send('The Garage Marketplace API'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))