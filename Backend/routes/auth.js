import express from "express"
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator"
import User from "../models/User.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").isMobilePhone().withMessage("Please provide a valid phone number"),
  ],
  async (req, res) => {
    try {
      console.log("Registration attempt:", { email: req.body.email, name: req.body.name })

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array())
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, phone, role, location } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        console.log("User already exists:", email)
        return res.status(400).json({ message: "User already exists with this email" })
      }

      const user = new User({
        name,
        email,
        password,
        phone,
        role: role || "customer",
        location: location || { coordinates: [0, 0], address: "" },
      })

      await user.save()
      console.log("User created successfully:", user._id)

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        message: "Server error during registration",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  },
)

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      console.log("Login attempt:", { email: req.body.email })

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array())
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        console.log("User not found:", email)
        return res.status(400).json({ message: "Invalid credentials" })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        console.log("Password mismatch for:", email)
        return res.status(400).json({ message: "Invalid credentials" })
      }

      if (!user.isActive) {
        console.log("Account deactivated:", email)
        return res.status(400).json({ message: "Account is deactivated" })
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      console.log("Login successful:", user._id)

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          avatar: user.avatar,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        message: "Server error during login",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  },
)

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes working!",
    timestamp: new Date().toISOString(),
  })
})

export default router
