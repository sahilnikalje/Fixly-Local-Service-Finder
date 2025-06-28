"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, Clock, MapPin } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Bookings = () => {
  const { user, api } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  const mockBookings = [
    {
      _id: "1",
      service: { name: "Electrical Repair" },
      provider: { user: { name: "Rajesh Sharma" } },
      customer: { name: user?.name || "Current User" },
      scheduledDate: new Date().toISOString(),
      scheduledTime: "10:00",
      location: { address: "Koregaon Park, Pune, Maharashtra 411001" },
      description: "Fix electrical outlet in kitchen and check main panel",
      price: 450,
      status: "pending",
    },
    {
      _id: "2",
      service: { name: "Plumbing Services" },
      provider: { user: { name: "Priya Patil" } },
      customer: { name: user?.name || "Current User" },
      scheduledDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      scheduledTime: "14:00",
      location: { address: "Baner, Pune, Maharashtra 411045" },
      description: "Fix leaky faucet in bathroom and check water pressure",
      price: 350,
      status: "completed",
    },
    {
      _id: "3",
      service: { name: "Math Tutoring" },
      provider: { user: { name: "Amit Kulkarni" } },
      customer: { name: user?.name || "Current User" },
      scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      scheduledTime: "16:00",
      location: { address: "Shivajinagar, Pune, Maharashtra 411005" },
      description: "Mathematics tutoring for 12th standard - Calculus and Trigonometry",
      price: 800,
      status: "confirmed",
    },
    {
      _id: "4",
      service: { name: "House Cleaning" },
      provider: { user: { name: "Sunita Deshmukh" } },
      customer: { name: user?.name || "Current User" },
      scheduledDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      scheduledTime: "09:00",
      location: { address: "Wakad, Pune, Maharashtra 411057" },
      description: "Deep cleaning of 2BHK apartment including kitchen and bathrooms",
      price: 600,
      status: "confirmed",
    },
  ]

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      console.log("Fetching bookings from API...")
      const response = await api.get("/api/bookings/my-bookings")
      console.log("Bookings fetched successfully:", response.data)
      setBookings(response.data)
    } catch (error) {
      console.log("API error, using mock data for bookings:", error.message)
      setBookings(mockBookings)
    } finally {
      setLoading(false)
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
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                      ? "border-blue-500 text-blue-600"
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
                      <span className="text-2xl font-bold text-blue-600">₹{booking.price}</span>
                      <div className="flex space-x-2">
                        <button className="btn btn-outline btn-sm">View Details</button>
                        {booking.status === "completed" && user?.role === "customer" && (
                          <button className="btn btn-primary btn-sm">Leave Review</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings
