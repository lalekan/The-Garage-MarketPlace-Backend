const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the Auth header
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user from the decoded token to req.user
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Attach the user information to the request for further use
    req.user = user
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token. Authorization failed' })
  }
}

module.exports = { authMiddleware }
