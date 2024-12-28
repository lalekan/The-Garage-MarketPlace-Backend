const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors') // CORS middleware
const path = require('path')
const AppRouter = require('./routes/appRouter')
const winston = require('winston')

dotenv.config()
const app = express()

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})

// CORS setup to allow requests from localhost:5173 during development
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow headers if necessary
}))

// Middleware
app.use(express.json())

// Handle OPTIONS requests explicitly (CORS preflight)
app.options('*', cors())


// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', AppRouter)

// Health check endpoint
app.get('/health', (req, res) => res.status(200).send('Healthy'))

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.message, err)
  res.status(500).json({ message: 'Internal Server Error', error: err.message })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err))

// Start server
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...')
  await mongoose.connection.close()
  server.close(() => logger.info('Server stopped'))
})
