import express from "express"
import Booking from "../models/Booking.js"
import Provider from "../models/Provider.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.post("/", authenticate, async (req, res) => {
  try {
    const booking = new Booking({
      customer: req.user.id,
      ...req.body,
    })

    await booking.save()

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("provider")
      .populate("service", "name category")

    const io = req.app.get("io")
    io.to(req.body.provider).emit("new-booking", populatedBooking)

    res.status(201).json(populatedBooking)
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/my-bookings", authenticate, async (req, res) => {
  try {
    let query
    if (req.user.role === "provider") {
      const provider = await Provider.findOne({ user: req.user.id })
      query = { provider: provider._id }
    } else {
      query = { customer: req.user.id }
    }

    const bookings = await Booking.find(query)
      .populate("customer", "name email phone")
      .populate("provider")
      .populate("service", "name category")
      .sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.patch("/:id/status", authenticate, async (req, res) => {
  try {
    const { status } = req.body
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    booking.status = status
    await booking.save()

    const io = req.app.get("io")
    io.to(booking.customer.toString()).emit("booking-updated", booking)

    res.json(booking)
  } catch (error) {
    console.error("Update booking status error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
