"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import toast from "react-hot-toast"

const BookingForm = () => {
  const { providerId, serviceId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [provider, setProvider] = useState(null)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    location: {
      coordinates: user?.location?.coordinates || [0, 0],
      address: user?.location?.address || "",
    },
    description: "",
    price: 0,
  })

  useEffect(() => {
    fetchData()
  }, [providerId, serviceId])

  const fetchData = async () => {
    try {
      const [providerResponse, serviceResponse] = await Promise.all([
        axios.get(`/api/providers/${providerId}`),
        axios.get(`/api/services/${serviceId}`),
      ])

      setProvider(providerResponse.data)
      setService(serviceResponse.data)

      const providerService = providerResponse.data.services.find((s) => s.service._id === serviceId)
      const price = providerService ? providerService.price : serviceResponse.data.basePrice

      setFormData((prev) => ({
        ...prev,
        price: price,
      }))
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Error loading booking form")
    } finally {
      setLoading(false)
    }
  }

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
    } else if (name === "duration") {
      const duration = Number.parseInt(value)
      const hourlyRate = formData.price / (formData.duration / 60)
      setFormData((prev) => ({
        ...prev,
        duration,
        price: Math.round(hourlyRate * (duration / 60)),
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
    setSubmitting(true)

    try {
      const bookingData = {
        provider: providerId,
        service: serviceId,
        ...formData,
      }

      await axios.post("/api/bookings", bookingData)
      toast.success("Booking created successfully!")
      navigate("/bookings")
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error(error.response?.data?.message || "Error creating booking")
    } finally {
      setSubmitting(false)
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(time)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!provider || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not available</h2>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Service</h1>
          <p className="text-lg text-gray-600">Schedule your appointment with {provider.user.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-sm text-gray-500 mt-1">Provider: {provider.user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">${formData.price}</p>
              <p className="text-sm text-gray-500">{formData.duration} minutes</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                required
                min={new Date().toISOString().split("T")[0]}
                className="input w-full"
                value={formData.scheduledDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Select Time
              </label>
              <select
                id="scheduledTime"
                name="scheduledTime"
                required
                className="input w-full"
                value={formData.scheduledTime}
                onChange={handleChange}
              >
                <option value="">Choose a time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                id="duration"
                name="duration"
                className="input w-full"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Service Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  className="input flex-1"
                  placeholder="Enter service address"
                  value={formData.location.address}
                  onChange={handleChange}
                />
                <button type="button" onClick={getCurrentLocation} className="btn btn-outline px-4">
                  Use Current Location
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Service Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="input w-full"
                placeholder="Describe what you need help with..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">
                  <DollarSign className="w-5 h-5 inline mr-1" />
                  Total Cost
                </span>
                <span className="text-2xl font-bold text-primary-600">${formData.price}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formData.duration} minutes at ${(formData.price / (formData.duration / 60)).toFixed(2)}/hour
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
                {submitting ? "Creating Booking..." : "Book Service"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
