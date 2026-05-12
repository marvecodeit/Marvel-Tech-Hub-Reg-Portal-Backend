import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

// Protect Routes
export const protect = async (req, res, next) => {
  try {
    let token

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // No Token
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized'
      })
    }

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Find User
    req.user = await User.findById(decoded.id).select('-password')

    next()
  } catch (error) {
    res.status(401).json({
      message: 'Token failed'
    })
  }
}

// Admin Middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({
      message: 'Admin access only'
    })
  }
}