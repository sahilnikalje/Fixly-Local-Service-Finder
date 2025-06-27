"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { MapPin, Star, Clock, Search } from "lucide-react"
import axios from "axios"

const Providers = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [providers, setProviders] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [filters, setFilters] = useState({
    service: searchParams.get("service") || "",
    location: searchParams.get("location") || "",
    radius: Number.parseInt(searchParams.get("radius")) || 10,
    minRating: Number.parseFloat(searchParams.get("minRating")) || 0,
  })

  const mockProviders = [
    {
      _id: "1",
      user: {
        _id: "1",
        name: "Ravi Electrician",
        email: "ravi@example.com",
        phone: "+919876543210",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Shivaji Nagar, Pune 411005",
        },
      },
      services: [
        {
          service: { _id: "1", name: "Electrical Repair", category: "electrical" },
          price: 600,
          experience: 5,
        },
        {
          service: { _id: "5", name: "Appliance Repair", category: "repair" },
          price: 700,
          experience: 3,
        },
      ],
      bio: "Skilled electrician with 5+ years of experience in residential and commercial electrical work across Pune.",
      experience: 5,
      rating: 4.8,
      totalReviews: 24,
      isVerified: true,
      availability: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "10:00", end: "15:00", available: true },
        sunday: { start: "10:00", end: "15:00", available: false },
      },
    },
    {
      _id: "2",
      user: {
        _id: "2",
        name: "Sneha Plumber",
        email: "sneha@example.com",
        phone: "+919812345678",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Kothrud, Pune 411038",
        },
      },
      services: [
        {
          service: { _id: "2", name: "Plumbing Services", category: "plumbing" },
          price: 500,
          experience: 3,
        },
      ],
      bio: "Reliable plumber with experience in residential and commercial installations across Pune.",
      experience: 3,
      rating: 4.6,
      totalReviews: 18,
      isVerified: true,
      availability: {
        monday: { start: "08:00", end: "18:00", available: true },
        tuesday: { start: "08:00", end: "18:00", available: true },
        wednesday: { start: "08:00", end: "18:00", available: true },
        thursday: { start: "08:00", end: "18:00", available: true },
        friday: { start: "08:00", end: "18:00", available: true },
        saturday: { start: "09:00", end: "16:00", available: true },
        sunday: { start: "09:00", end: "16:00", available: false },
      },
    },
    {
      _id: "3",
      user: {
        _id: "3",
        name: "Madhav Math Tutor",
        email: "madhav@example.com",
        phone: "+919834567890",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Aundh, Pune 411007",
        },
      },
      services: [
        {
          service: { _id: "3", name: "Math Tutoring", category: "tutoring" },
          price: 400,
          experience: 7,
        },
      ],
      bio: "Dedicated math teacher with 7 years of experience tutoring students from high school to college in Pune.",
      experience: 7,
      rating: 4.9,
      totalReviews: 32,
      isVerified: true,
      availability: {
        monday: { start: "15:00", end: "20:00", available: true },
        tuesday: { start: "15:00", end: "20:00", available: true },
        wednesday: { start: "15:00", end: "20:00", available: true },
        thursday: { start: "15:00", end: "20:00", available: true },
        friday: { start: "15:00", end: "20:00", available: true },
        saturday: { start: "10:00", end: "18:00", available: true },
        sunday: { start: "10:00", end: "18:00", available: true },
      },
    },
    {
      _id: "4",
      user: {
        _id: "4",
        name: "Lata Cleaner",
        email: "lata@example.com",
        phone: "+919923456781",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Viman Nagar, Pune 411014",
        },
      },
      services: [
        {
          service: { _id: "4", name: "House Cleaning", category: "cleaning" },
          price: 450,
          experience: 4,
        },
      ],
      bio: "Trustworthy house cleaning service using eco-friendly products across Pune.",
      experience: 4,
      rating: 4.7,
      totalReviews: 28,
      isVerified: true,
      availability: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "10:00", end: "16:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false },
      },
    },
    {
      _id: "5",
      user: {
        _id: "5",
        name: "Amit Handyman",
        email: "amit@example.com",
        phone: "+919765432101",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Baner, Pune 411045",
        },
      },
      services: [
        {
          service: { _id: "5", name: "Appliance Repair", category: "repair" },
          price: 550,
          experience: 6,
        },
        {
          service: { _id: "6", name: "General Maintenance", category: "maintenance" },
          price: 600,
          experience: 6,
        },
      ],
      bio: "Skilled handyman offering appliance repair and general maintenance across Pune.",
      experience: 6,
      rating: 4.5,
      totalReviews: 21,
      isVerified: true,
      availability: {
        monday: { start: "08:00", end: "18:00", available: true },
        tuesday: { start: "08:00", end: "18:00", available: true },
        wednesday: { start: "08:00", end: "18:00", available: true },
        thursday: { start: "08:00", end: "18:00", available: true },
        friday: { start: "08:00", end: "18:00", available: true },
        saturday: { start: "09:00", end: "17:00", available: true },
        sunday: { start: "09:00", end: "17:00", available: false },
      },
    },
  ]

  const mockServices = [
    { _id: "1", name: "Electrical Repair", category: "electrical" },
    { _id: "2", name: "Plumbing Services", category: "plumbing" },
    { _id: "3", name: "Math Tutoring", category: "tutoring" },
    { _id: "4", name: "House Cleaning", category: "cleaning" },
    { _id: "5", name: "Appliance Repair", category: "repair" },
    { _id: "6", name: "General Maintenance", category: "maintenance" },
  ]

  useEffect(() => {
    fetchServices()
    fetchProviders()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services")
      setServices(response.data)
    } catch (error) {
      console.log("Using mock data for services")
      setServices(mockServices)
    }
  }

  const fetchProviders = async () => {
    try {
      setSearchLoading(true)
      const params = new URLSearchParams()

      if (filters.service) params.append("service", filters.service)
      if (filters.location) {
        const locationCoords = getLocationCoordinates(filters.location)
        if (locationCoords) {
          params.append("lat", locationCoords.lat)
          params.append("lng", locationCoords.lng)
          params.append("radius", filters.radius)
        }
      }

      const response = await axios.get(`/api/providers/search?${params}`)
      let filteredProviders = response.data

      if (filters.minRating > 0) {
        filteredProviders = filteredProviders.filter((provider) => provider.rating >= filters.minRating)
      }

      setProviders(filteredProviders)
    } catch (error) {
      console.log("Using mock data for providers")
      let filteredProviders = [...mockProviders]

      if (filters.service) {
        filteredProviders = filteredProviders.filter((provider) =>
          provider.services.some((service) => service.service._id === filters.service),
        )
      }

      if (filters.minRating > 0) {
        filteredProviders = filteredProviders.filter((provider) => provider.rating >= filters.minRating)
      }

      if (filters.location) {
        const searchLocation = filters.location.toLowerCase()
        filteredProviders = filteredProviders.filter((provider) =>
          provider.user.location.address.toLowerCase().includes(searchLocation),
        )
      }

      setProviders(filteredProviders)
    } finally {
      setSearchLoading(false)
      setLoading(false)
    }
  }

  const getLocationCoordinates = (location) => {
    const locationMap = {
      pune: { lat: "18.5204", lng: "73.8567" },
      "shivaji nagar": { lat: "18.5357", lng: "73.8499" },
      kothrud: { lat: "18.5074", lng: "73.8077" },
      aundh: { lat: "18.5615", lng: "73.8073" },
      "viman nagar": { lat: "18.5679", lng: "73.9141" },
      baner: { lat: "18.5649", lng: "73.7777" },
    }

    const searchKey = location.toLowerCase()
    for (const [key, coords] of Object.entries(locationMap)) {
      if (searchKey.includes(key)) {
        return coords
      }
    }
    return null
  }

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    }
    setFilters(newFilters)

    const newSearchParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "" && v !== 0) {
        newSearchParams.set(k, v.toString())
      }
    })
    setSearchParams(newSearchParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProviders()
  }

  const clearFilters = () => {
    const clearedFilters = {
      service: "",
      location: "",
      radius: 10,
      minRating: 0,
    }
    setFilters(clearedFilters)
    setSearchParams({})
    setTimeout(() => {
      fetchProviders()
    }, 100)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId)
    return service ? service.name : "Service"
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Providers</h1>
          <p className="text-lg text-gray-600">Find trusted professionals in your area</p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {providers.length} provider{providers.length !== 1 ? "s" : ""}
            {filters.location && ` in ${filters.location}`}
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
              <select
                className="input w-full"
                value={filters.service}
                onChange={(e) => handleFilterChange("service", e.target.value)}
              >
                <option value="">All Services</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="input w-full"
                placeholder="City, ZIP code"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Radius</label>
              <select
                className="input w-full"
                value={filters.radius}
                onChange={(e) => handleFilterChange("radius", Number.parseInt(e.target.value))}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                className="input w-full"
                value={filters.minRating}
                onChange={(e) => handleFilterChange("minRating", Number.parseFloat(e.target.value))}
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={searchLoading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {(filters.service || filters.location || filters.minRating > 0) && (
            <div className="mt-4 flex justify-center">
              <button type="button" onClick={clearFilters} className="btn btn-outline btn-sm">
                Clear All Filters
              </button>
            </div>
          )}
        </form>

        {searchLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for providers...</p>
          </div>
        )}

        {!searchLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div key={provider._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{provider.user.name}</h2>
                    <div className="flex items-center mt-1">
                      {renderStars(Math.round(provider.rating))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({provider.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {provider.user.location.address}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service) => (
                      <span
                        key={service.service._id}
                        className="bg-gray-100 text-gray-700 text-sm rounded-full px-3 py-1"
                      >
                        {getServiceName(service.service._id)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 text-gray-600 text-sm">{provider.bio}</div>

                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/providers/${provider._id}`}
                    className="btn btn-primary flex items-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searchLoading && providers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900">No providers found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your search criteria or expanding the search radius.</p>
            <button onClick={clearFilters} className="btn btn-primary mt-4">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Providers
