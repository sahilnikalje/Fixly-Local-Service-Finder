"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Calendar, Clock, Star, MapPin, Plus } from "lucide-react"
import axios from "axios"

const Dashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/bookings/my-bookings")
      const bookingsData = response.data

      setBookings(bookingsData.slice(0, 5)) // Show only recent 5 bookings

      // Calculate stats
      const stats = {
        totalBookings: bookingsData.length,
        pendingBookings: bookingsData.filter((b) => b.status === "pending").length,
        completedBookings: bookingsData.filter((b) => b.status === "completed").length,
        totalSpent: bookingsData.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.price, 0),
      }

      setStats(stats)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                  <Link to="/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings yet</p>
                    <Link to="/services" className="btn btn-primary mt-4">
                      Book a Service
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{booking.service?.name}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                          </p>
                          <p className="text-sm text-gray-500">${booking.price}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/services" className="btn btn-primary w-full flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Book New Service
                </Link>
                <Link to="/providers" className="btn btn-outline w-full">
                  Find Providers
                </Link>
                <Link to="/bookings" className="btn btn-outline w-full">
                  View All Bookings
                </Link>
              </div>
            </div>

            {user?.role === "customer" && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Become a Provider</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Start earning by offering your services to customers in your area.
                </p>
                <Link to="/register?role=provider" className="btn btn-primary w-full">
                  Get Started
                </Link>
              </div>
            )}

            {/* Profile, Services, Bookings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
                <p className="text-gray-600">Manage your account settings</p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Services</h3>
                <p className="text-gray-600">Browse available services</p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bookings</h3>
                <p className="text-gray-600">View your appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
