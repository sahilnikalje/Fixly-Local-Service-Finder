"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import toast from "react-hot-toast"

const ReviewForm = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  })

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      // Mock booking data for now
      const mockBooking = {
        _id: bookingId,
        service: { name: "Electrical Repair" },
        provider: { user: { name: "John Electrician" } },
        scheduledDate: new Date().toISOString(),
        scheduledTime: "10:00",
        price: 85,
        status: "completed",
      }
      setBooking(mockBooking)
    } catch (error) {
      console.error("Error fetching booking:", error)
      toast.error("Error loading booking details")
    } finally {
      setLoading(false)
    }
  }

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setSubmitting(true)

    try {
      await axios.post("/api/reviews", {
        bookingId,
        rating: formData.rating,
        comment: formData.comment,
      })
      toast.success("Review submitted successfully!")
      navigate("/bookings")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error(error.response?.data?.message || "Error submitting review")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <button onClick={() => navigate("/bookings")} className="btn btn-primary">
            Back to Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Leave a Review</h1>
          <p className="text-lg text-gray-600">Share your experience with {booking.provider.user.name}</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-medium">{booking.service.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium">{booking.provider.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">
                {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="font-medium">${booking.price}</p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">How would you rate this service?</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {formData.rating > 0 && (
                    <>
                      {formData.rating} star{formData.rating !== 1 ? "s" : ""}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Tell others about your experience
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={5}
                required
                className="input w-full"
                placeholder="Describe the quality of service, professionalism, timeliness, etc."
                value={formData.comment}
                onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
              />
              <p className="text-sm text-gray-500 mt-1">Minimum 10 characters required</p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="btn btn-outline flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={submitting || formData.rating === 0 || formData.comment.length < 10}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewForm
