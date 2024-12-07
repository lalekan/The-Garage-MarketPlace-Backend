const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const middleware = require('../middleware/auth')
const {User, Listing, Message} = require('../models/user')



// Sign up User
// const registerUser = async (req, res) => {
//   const { username, password, confirmPassword, email } = req.body

//   try {
//     // Ensure both passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: 'Passwords do not match' })
//     }

//     if (!username || !password || !confirmPassword || !email) {
//       return res.status(400).json({ message: 'All fields are required' })
//     } 

//     // Validate password length
//     if (password.length < 6) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters' })
//     }

//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already exists' })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)
//     const newUser = new User({
//       username,
//       password: hashedPassword,
//       email,
//     })
//     await newUser.save()

//     res.status(201).json({ message: 'User registered successfully' })
//   } catch (err) {
//     console.error('Error registering user:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// }

const registerUser = async (req, res) => {
  try {
    const { username, password, confirmPassword, email, image, bio } = req.body
    let passwordDigest = await middleware.hashPassword(password)
    const user = await User.create({
      username,
      password,
      confirmPassword,
      email,
      passwordDigest,
      image,
      bio
    })
    res.send(user)
  } catch (error) {
    throw error
  }
}


// Sign in User
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
      raw: true
    })
    if (
      user &&
      (await middleware.comparePassword(
        user.password,
        req.body.password
      ))
    ) {
      let payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        bio: user.bio,
      }
      let token = middleware.createToken(payload)
      return res.send({ user: payload, token })
    }
    res.status(401).send({
      status: 'Error',
      msg: 'You are not authorized to enter this page. Please vacate immediately!'
    })
  } catch (error) {
    throw error
  }
}



// Fetch User Profile
const getUserProfile = async (req, res) => {

  if (!email || !password) {
    console.log('Missing email or password:', req.body) // Log the request body
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const user = await User.findById(req.user.id).select('-password').populate('listings')
    if (!user) return res.status(404).json({ message: 'User not found' })
  
    res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update user password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body
    const user = await User.findByPk(req.params.user_id)
    if (
      user &&
      newPassword === confirmNewPassword &&
      (await middleware.comparePassword(
        user.dataValues.password,
        oldPassword
      ))
    ) {
      let passwordDigest = await middleware.hashPassword(newPassword)
      await user.update({ passwordDigest })
      return res.send({ status: 'You got it!', payload: user })
    }
    res
      .status(401)
      .send({ status: 'Uh-oh, try again!', msg: "You can't do that!" })
  } catch (error) {
    throw error
  }
}

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (username) user.username = username
    if (email) user.email = email
    if (password) user.password = await bcrypt.hash(password, 12)

    await user.save()
    res.status(200).json({ message: 'Profile updated successfully', user })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete User Account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Remove user's listings
    await Listing.deleteMany({ author: user._id })

    // Remove user
    await user.remove()

    res.status(200).json({ message: 'Account deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}


// Middleware to protect routes - Verifying JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }
}

const checkSession = async (req, res) => {
  const { payload } = res.locals
  res.send(payload)
}

module.exports = { registerUser, loginUser, updatePassword, getUserProfile, authMiddleware, updateUserProfile, deleteUserAccount, checkSession }
