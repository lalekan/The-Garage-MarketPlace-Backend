const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors') 
const path = require('path')
const AppRouter = require('./routes/appRouter')
const winston = require('winston')

dotenv.config()
const app = express()

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}))

// Middleware
app.use(express.json())

app.options('*', cors())


// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', AppRouter)

app.get('/health', (req, res) => res.status(200).send('Healthy'))

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

// Shutdown Server
process.on('SIGINT', async () => {
  logger.info('Shutting down server...')
  await mongoose.connection.close()
  server.close(() => logger.info('Server stopped'))
})
