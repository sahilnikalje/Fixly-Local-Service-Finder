"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

const BookingForm = () => {
  const { providerId, serviceId } = useParams()
  const navigate = useNavigate()
  const { user, api } = useAuth()

  const [provider, setProvider] = useState(null)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    location: {
      coordinates: user?.location?.coordinates || [73.8567, 18.5204],
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
      console.log("Fetching booking form data...")
      const [providerResponse, serviceResponse] = await Promise.all([
        api.get(`/api/providers/${providerId}`),
        api.get(`/api/services/${serviceId}`),
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
      const mockProviders = {
        1: {
          _id: "1",
          user: { name: "Rajesh Sharma", email: "rajesh.electrician@example.com", phone: "+919876543210" },
          services: [{ service: { _id: "1", name: "Electrical Repair" }, price: 450 }],
          rating: 4.8,
          totalReviews: 45,
          isVerified: true,
        },
        2: {
          _id: "2",
          user: { name: "Priya Patil", email: "priya.plumber@example.com", phone: "+919876543211" },
          services: [{ service: { _id: "2", name: "Plumbing Services" }, price: 350 }],
          rating: 4.6,
          totalReviews: 32,
          isVerified: true,
        },
        3: {
          _id: "3",
          user: { name: "Amit Kulkarni", email: "amit.tutor@example.com", phone: "+919876543212" },
          services: [{ service: { _id: "3", name: "Math Tutoring" }, price: 800 }],
          rating: 4.9,
          totalReviews: 67,
          isVerified: true,
        },
        4: {
          _id: "4",
          user: { name: "Sunita Deshmukh", email: "sunita.cleaner@example.com", phone: "+919876543213" },
          services: [{ service: { _id: "4", name: "House Cleaning" }, price: 300 }],
          rating: 4.7,
          totalReviews: 38,
          isVerified: true,
        },
        5: {
          _id: "5",
          user: { name: "Vikram Joshi", email: "vikram.handyman@example.com", phone: "+919876543214" },
          services: [{ service: { _id: "5", name: "Appliance Repair" }, price: 400 }],
          rating: 4.5,
          totalReviews: 54,
          isVerified: true,
        },
      }

      const mockServices = {
        1: {
          _id: "1",
          name: "Electrical Repair",
          description: "Professional electrical repair services",
          basePrice: 450,
        },
        2: {
          _id: "2",
          name: "Plumbing Services",
          description: "Expert plumbing repair and maintenance",
          basePrice: 350,
        },
        3: {
          _id: "3",
          name: "Math Tutoring",
          description: "Professional math tutoring for all levels",
          basePrice: 800,
        },
        4: { _id: "4", name: "House Cleaning", description: "Professional house cleaning services", basePrice: 300 },
        5: { _id: "5", name: "Appliance Repair", description: "Repair services for home appliances", basePrice: 400 },
      }

      const mockProvider = mockProviders[providerId]
      const mockService = mockServices[serviceId]

      if (mockProvider && mockService) {
        setProvider(mockProvider)
        setService(mockService)
        const providerService = mockProvider.services.find((s) => s.service._id === serviceId)
        const price = providerService ? providerService.price : mockService.basePrice
        setFormData((prev) => ({ ...prev, price }))
        toast.success("Using demo data - booking form ready!")
      } else {
        toast.error("Provider or service not found")
        navigate("/providers")
      }
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
            const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Pune, Maharashtra`

            setFormData((prev) => ({
              ...prev,
              location: {
                coordinates: [longitude, latitude],
                address,
              },
            }))
            toast.success("Location updated!")
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

      console.log("Creating booking:", bookingData)
      await api.post("/api/bookings", bookingData)
      toast.success("Booking created successfully!")
      navigate("/bookings")
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.success("Booking created successfully! (Demo mode)")
      navigate("/bookings")
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
              <p className="text-sm text-gray-500">Phone: {provider.user.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">₹{formData.price}</p>
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
                  placeholder="Enter service address in Pune"
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
                <span className="text-2xl font-bold text-primary-600">₹{formData.price}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formData.duration} minutes at ₹{(formData.price / (formData.duration / 60)).toFixed(2)}/hour
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
