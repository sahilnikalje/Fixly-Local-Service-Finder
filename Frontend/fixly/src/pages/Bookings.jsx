"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, Clock, MapPin, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

const Bookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/bookings/my-bookings")
      setBookings(response.data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}/status`, { status })
      setBookings((prev) => prev.map((booking) => (booking._id === bookingId ? { ...booking, status } : booking)))
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage your service appointments</p>
          </div>
          <Link to="/services" className="btn btn-primary">
            Book New Service
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "all", label: "All Bookings" },
                { key: "pending", label: "Pending" },
                { key: "confirmed", label: "Confirmed" },
                { key: "in-progress", label: "In Progress" },
                { key: "completed", label: "Completed" },
                { key: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {bookings.filter((b) => (tab.key === "all" ? true : b.status === tab.key)).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {filter === "all" ? "You haven't made any bookings yet." : `No ${filter} bookings found.`}
            </p>
            <Link to="/services" className="btn btn-primary">
              Book Your First Service
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{booking.service?.name}</h3>
                        <p className="text-gray-600">
                          {user?.role === "customer" ? "Provider" : "Customer"}:{" "}
                          {user?.role === "customer" ? booking.provider?.user?.name : booking.customer?.name}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{formatDate(booking.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{booking.scheduledTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="truncate">{booking.location.address}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{booking.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">${booking.price}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => setSelectedBooking(booking)} className="btn btn-outline btn-sm">
                          View Details
                        </button>

                        {user?.role === "provider" && booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking._id, "confirmed")}
                              className="btn btn-primary btn-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, "cancelled")}
                              className="btn bg-red-600 text-white hover:bg-red-700 btn-sm"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, "in-progress")}
                            className="btn btn-primary btn-sm"
                          >
                            Start Service
                          </button>
                        )}

                        {booking.status === "in-progress" && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, "completed")}
                            className="btn btn-primary btn-sm"
                          >
                            Complete
                          </button>
                        )}

                        {booking.status === "completed" && user?.role === "customer" && (
                          <Link to={`/review/${booking._id}`} className="btn btn-primary btn-sm">
                            Leave Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Service</h3>
                    <p className="text-gray-600">{selectedBooking.service?.name}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user?.role === "customer" ? "Provider" : "Customer"}
                    </h3>
                    <p className="text-gray-600">
                      {user?.role === "customer"
                        ? selectedBooking.provider?.user?.name
                        : selectedBooking.customer?.name}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Date & Time</h3>
                    <p className="text-gray-600">
                      {formatDate(selectedBooking.scheduledDate)} at {selectedBooking.scheduledTime}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">{selectedBooking.location.address}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-600">{selectedBooking.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Price</h3>
                    <p className="text-2xl font-bold text-primary-600">${selectedBooking.price}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Status</h3>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                  {selectedBooking.notes && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Notes</h3>
                      <p className="text-gray-600">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings
