const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const AppRouter = require('./routes/appRouter')
const winston = require('winston')
const fs = require('fs')

dotenv.config()
const app = express()

// Ensure uploads directory exists
const uploadDir = './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://leafy-muffin-35a7bf.netlify.app', // Deployed frontend
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        logger.error(`Blocked by CORS: ${origin}`)
        callback(new Error(`CORS Error: Origin ${origin} not allowed`))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)


// Middleware
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api', AppRouter)

app.get('/health', (req, res) => res.status(200).send('Healthy'))

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.message, err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error('MongoDB connection error:', err))

// Start server
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))

// Shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...')
  await mongoose.connection.close()
  server.close(() => logger.info('Server stopped'))
})
