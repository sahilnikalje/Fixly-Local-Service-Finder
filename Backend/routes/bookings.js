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
    if (io && req.body.provider) {
      io.to(req.body.provider).emit("new-booking", populatedBooking)
    }

    res.status(201).json(populatedBooking)
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/my-bookings", authenticate, async (req, res) => {
  try {
    let query
    let bookings = []

    if (req.user.role === "provider") {
      const provider = await Provider.findOne({ user: req.user.id })

      if (provider) {
        query = { provider: provider._id }
        bookings = await Booking.find(query)
          .populate("customer", "name email phone")
          .populate("provider")
          .populate("service", "name category")
          .sort({ createdAt: -1 })
      }
    } else {
      query = { customer: req.user.id }
      bookings = await Booking.find(query)
        .populate("customer", "name email phone")
        .populate("provider")
        .populate("service", "name category")
        .sort({ createdAt: -1 })
    }

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/:id", authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("provider")
      .populate("service", "name category")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    const hasAccess =
      booking.customer._id.toString() === req.user.id ||
      (booking.provider && booking.provider.user && booking.provider.user.toString() === req.user.id)

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Get booking error:", error)
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

    const provider = await Provider.findOne({ user: req.user.id })
    const isProvider = provider && booking.provider.toString() === provider._id.toString()
    const isCustomer = booking.customer.toString() === req.user.id

    if (!isProvider && !isCustomer) {
      return res.status(403).json({ message: "Not authorized to update this booking" })
    }

    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["in-progress", "cancelled"],
      "in-progress": ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    }

    if (!validTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({ message: "Invalid status transition" })
    }

    booking.status = status
    await booking.save()

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("provider")
      .populate("service", "name category")

    const io = req.app.get("io")
    if (io) {
      io.to(booking.customer.toString()).emit("booking-updated", updatedBooking)
      if (booking.provider) {
        io.to(booking.provider.toString()).emit("booking-updated", updatedBooking)
      }
    }

    res.json(updatedBooking)
  } catch (error) {
    console.error("Update booking status error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.patch("/:id/cancel", authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    const provider = await Provider.findOne({ user: req.user.id })
    const isProvider = provider && booking.provider.toString() === provider._id.toString()
    const isCustomer = booking.customer.toString() === req.user.id

    if (!isProvider && !isCustomer) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" })
    }

    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({ message: "Cannot cancel booking in current status" })
    }

    booking.status = "cancelled"
    await booking.save()

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("provider")
      .populate("service", "name category")

    const io = req.app.get("io")
    if (io) {
      io.to(booking.customer.toString()).emit("booking-updated", updatedBooking)
      if (booking.provider) {
        io.to(booking.provider.toString()).emit("booking-updated", updatedBooking)
      }
    }

    res.json(updatedBooking)
  } catch (error) {
    console.error("Cancel booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
