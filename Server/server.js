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
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())


// Use auth route
// app.use('/api/auth', authRoutes)
app.use('/api/listing', listingRoutes)
// app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.status(500).json({ message: 'Something went wrong', error: err.message })
  next()
  console.error(err.stack)
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.get('/', (req, res) => res.send('The Garage Marketplace API'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))