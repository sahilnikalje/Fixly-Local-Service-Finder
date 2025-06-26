"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: {
      address: "",
      coordinates: [0, 0],
    },
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: {
          address: user.location?.address || "",
          coordinates: user.location?.coordinates || [0, 0],
        },
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "address") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

            setFormData((prev) => ({
              ...prev,
              location: {
                coordinates: [longitude, latitude],
                address,
              },
            }))
          } catch (error) {
            console.error("Error getting address:", error)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          toast.error("Unable to get current location")
        },
      )
    } else {
      toast.error("Geolocation is not supported by this browser")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put("/api/users/profile", formData)
      updateUser(response.data)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.message || "Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Settings</h1>
          <p className="text-lg text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mr-6">
              {user?.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-gray-600">{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              <button className="btn btn-outline btn-sm mt-2 flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input w-full"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="input w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="input w-full"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="input flex-1"
                  placeholder="Enter your address"
                  value={formData.location.address}
                  onChange={handleChange}
                />
                <button type="button" onClick={getCurrentLocation} className="btn btn-outline px-4">
                  Use Current Location
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="capitalize font-medium">{user?.role}</span>
                <p className="text-sm text-gray-600 mt-1">
                  {user?.role === "customer"
                    ? "You can book services from providers"
                    : "You can offer services to customers"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn btn-primary flex items-center">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates about your bookings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Get text messages for important updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 mt-8 border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <button className="btn bg-red-600 text-white hover:bg-red-700">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
