import express from "express"
import Review from "../models/Review.js"
import Provider from "../models/Provider.js"
import Booking from "../models/Booking.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.post("/", authenticate, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body

    const booking = await Booking.findById(bookingId)
    if (!booking || booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to review this booking" })
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Can only review completed bookings" })
    }

    const existingReview = await Review.findOne({ booking: bookingId })
    if (existingReview) {
      return res.status(400).json({ message: "Review already exists for this booking" })
    }

    const review = new Review({
      booking: bookingId,
      customer: req.user.id,
      provider: booking.provider,
      rating,
      comment,
    })

    await review.save()

    const reviews = await Review.find({ provider: booking.provider })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await Provider.findByIdAndUpdate(booking.provider, {
      rating: avgRating,
      totalReviews: reviews.length,
    })

    const populatedReview = await Review.findById(review._id)
      .populate("customer", "name avatar")
      .populate("booking", "service scheduledDate")

    res.status(201).json(populatedReview)
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/provider/:providerId", async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("customer", "name avatar")
      .populate("booking", "service scheduledDate")
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
