import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

// Register a new user
export const register = async (req, res) => {
  try {
    const {  
     fullname,
      email,
      password,
      phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const user = new User({
       fullname,
      email,
      password: hashedPassword,
      phone
    })

    await user.save()

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}