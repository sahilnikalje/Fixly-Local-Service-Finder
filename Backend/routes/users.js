import express from "express"
import User from "../models/User.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.put("/profile", authenticate, async (req, res) => {
  try {
    const updates = req.body
    delete updates.password 

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select(
      "-password",
    )

    res.json(user)
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
