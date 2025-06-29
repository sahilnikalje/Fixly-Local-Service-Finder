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
        name: "Rajesh Sharma",
        email: "rajesh.electrician@example.com",
        phone: "+919876543210",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Koregaon Park, Pune, Maharashtra 411001",
        },
      },
      services: [
        {
          service: { _id: "1", name: "Electrical Repair", category: "electrical" },
          price: 450,
          experience: 8,
        },
      ],
      bio: "Experienced electrician with 8+ years in residential and commercial electrical work. Licensed and certified by Maharashtra Electrical Board.",
      experience: 8,
      rating: 4.8,
      totalReviews: 45,
      isVerified: true,
      availability: {
        monday: { start: "09:00", end: "18:00", available: true },
        tuesday: { start: "09:00", end: "18:00", available: true },
        wednesday: { start: "09:00", end: "18:00", available: true },
        thursday: { start: "09:00", end: "18:00", available: true },
        friday: { start: "09:00", end: "18:00", available: true },
        saturday: { start: "10:00", end: "17:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false },
      },
    },
    {
      _id: "2",
      user: {
        _id: "2",
        name: "Priya Patil",
        email: "priya.plumber@example.com",
        phone: "+919876543211",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Baner, Pune, Maharashtra 411045",
        },
      },
      services: [
        {
          service: { _id: "2", name: "Plumbing Services", category: "plumbing" },
          price: 350,
          experience: 5,
        },
      ],
      bio: "Professional plumber specializing in residential repairs and installations. Expert in modern plumbing systems and water conservation.",
      experience: 5,
      rating: 4.6,
      totalReviews: 32,
      isVerified: true,
      availability: {
        monday: { start: "08:00", end: "18:00", available: true },
        tuesday: { start: "08:00", end: "18:00", available: true },
        wednesday: { start: "08:00", end: "18:00", available: true },
        thursday: { start: "08:00", end: "18:00", available: true },
        friday: { start: "08:00", end: "18:00", available: true },
        saturday: { start: "09:00", end: "17:00", available: true },
        sunday: { start: "09:00", end: "16:00", available: false },
      },
    },
    {
      _id: "3",
      user: {
        _id: "3",
        name: "Amit Kulkarni",
        email: "amit.tutor@example.com",
        phone: "+919876543212",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Shivajinagar, Pune, Maharashtra 411005",
        },
      },
      services: [
        {
          service: { _id: "3", name: "Math Tutoring", category: "tutoring" },
          price: 800,
          experience: 10,
        },
      ],
      bio: "M.Tech graduate with 10 years of tutoring experience. Specializing in Mathematics, Physics, and Engineering subjects for 10th-12th and competitive exams.",
      experience: 10,
      rating: 4.9,
      totalReviews: 67,
      isVerified: true,
      availability: {
        monday: { start: "16:00", end: "21:00", available: true },
        tuesday: { start: "16:00", end: "21:00", available: true },
        wednesday: { start: "16:00", end: "21:00", available: true },
        thursday: { start: "16:00", end: "21:00", available: true },
        friday: { start: "16:00", end: "21:00", available: true },
        saturday: { start: "10:00", end: "18:00", available: true },
        sunday: { start: "10:00", end: "18:00", available: true },
      },
    },
    {
      _id: "4",
      user: {
        _id: "4",
        name: "Sunita Deshmukh",
        email: "sunita.cleaner@example.com",
        phone: "+919876543213",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Wakad, Pune, Maharashtra 411057",
        },
      },
      services: [
        {
          service: { _id: "4", name: "House Cleaning", category: "cleaning" },
          price: 300,
          experience: 6,
        },
      ],
      bio: "Professional house cleaning service with eco-friendly products. Specialized in deep cleaning, sanitization, and home organization.",
      experience: 6,
      rating: 4.7,
      totalReviews: 38,
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
        name: "Vikram Joshi",
        email: "vikram.handyman@example.com",
        phone: "+919876543214",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Hinjewadi, Pune, Maharashtra 411057",
        },
      },
      services: [
        {
          service: { _id: "5", name: "Appliance Repair", category: "repair" },
          price: 400,
          experience: 12,
        },
        {
          service: { _id: "6", name: "General Maintenance", category: "maintenance" },
          price: 350,
          experience: 12,
        },
      ],
      bio: "Skilled handyman offering appliance repair and general maintenance services. Expert in AC repair, washing machine service, and home maintenance.",
      experience: 12,
      rating: 4.5,
      totalReviews: 54,
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
    {
      _id: "6",
      user: {
        _id: "6",
        name: "Kavita Bhosale",
        email: "kavita.tutor@example.com",
        phone: "+919876543215",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Kothrud, Pune, Maharashtra 411038",
        },
      },
      services: [
        {
          service: { _id: "3", name: "Language Tutoring", category: "tutoring" },
          price: 600,
          experience: 8,
        },
      ],
      bio: "B.Ed qualified teacher with 8 years experience in teaching English, Hindi, and Marathi. Specialized in primary and secondary education.",
      experience: 8,
      rating: 4.8,
      totalReviews: 29,
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
      _id: "7",
      user: {
        _id: "7",
        name: "Suresh Pawar",
        email: "suresh.electrician@example.com",
        phone: "+919876543216",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Pimpri-Chinchwad, Pune, Maharashtra 411018",
        },
      },
      services: [
        {
          service: { _id: "1", name: "Electrical Repair", category: "electrical" },
          price: 500,
          experience: 15,
        },
      ],
      bio: "Senior electrician with 15+ years experience. Specialized in industrial and residential electrical installations, solar panel setup, and electrical safety audits.",
      experience: 15,
      rating: 4.9,
      totalReviews: 78,
      isVerified: true,
      availability: {
        monday: { start: "08:00", end: "19:00", available: true },
        tuesday: { start: "08:00", end: "19:00", available: true },
        wednesday: { start: "08:00", end: "19:00", available: true },
        thursday: { start: "08:00", end: "19:00", available: true },
        friday: { start: "08:00", end: "19:00", available: true },
        saturday: { start: "09:00", end: "17:00", available: true },
        sunday: { start: "09:00", end: "17:00", available: false },
      },
    },
    {
      _id: "8",
      user: {
        _id: "8",
        name: "Meera Jadhav",
        email: "meera.cleaner@example.com",
        phone: "+919876543217",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Aundh, Pune, Maharashtra 411007",
        },
      },
      services: [
        {
          service: { _id: "4", name: "House Cleaning", category: "cleaning" },
          price: 280,
          experience: 4,
        },
      ],
      bio: "Professional cleaning service provider with trained staff. Offering residential and commercial cleaning, carpet cleaning, and post-construction cleanup.",
      experience: 4,
      rating: 4.4,
      totalReviews: 23,
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
    setProviders(mockProviders)
    setLoading(false)
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
      console.log("Fetching providers from API...")

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

      console.log("Providers fetched successfully:", filteredProviders)
      setProviders(filteredProviders)
    } catch (error) {
      console.log("API error, using mock data for providers:", error.message)
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

      console.log("Using mock providers:", filteredProviders)
      setProviders(filteredProviders)
    } finally {
      setSearchLoading(false)
      setLoading(false)
    }
  }

  const getLocationCoordinates = (location) => {
    const locationMap = {
      pune: { lat: "18.5204", lng: "73.8567" },
      koregaon: { lat: "18.5362", lng: "73.8958" },
      baner: { lat: "18.5679", lng: "73.7781" },
      shivajinagar: { lat: "18.5309", lng: "73.8553" },
      wakad: { lat: "18.5975", lng: "73.7898" },
      hinjewadi: { lat: "18.5912", lng: "73.7389" },
      kothrud: { lat: "18.5074", lng: "73.8077" },
      pimpri: { lat: "18.6298", lng: "73.8131" },
      chinchwad: { lat: "18.6186", lng: "73.8037" },
      aundh: { lat: "18.5593", lng: "73.8078" },
      hadapsar: { lat: "18.5089", lng: "73.9260" },
      viman: { lat: "18.5679", lng: "73.9143" },
      411001: { lat: "18.5204", lng: "73.8567" },
      411045: { lat: "18.5679", lng: "73.7781" },
      411005: { lat: "18.5309", lng: "73.8553" },
      411057: { lat: "18.5975", lng: "73.7898" },
      411038: { lat: "18.5074", lng: "73.8077" },
      411018: { lat: "18.6298", lng: "73.8131" },
      411007: { lat: "18.5593", lng: "73.8078" },
      411028: { lat: "18.5089", lng: "73.9260" },
      411014: { lat: "18.5679", lng: "73.9143" },
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Providers in Pune</h1>
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
                placeholder="Baner, Koregaon Park, etc."
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
              <div key={provider._id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      {provider.user.avatar ? (
                        <img
                          src={provider.user.avatar || "/placeholder.svg"}
                          alt={provider.user.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-gray-600">
                          {provider.user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{provider.user.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center mr-2">{renderStars(Math.floor(provider.rating))}</div>
                        <span className="text-sm text-gray-600">
                          {provider.rating.toFixed(1)} ({provider.totalReviews} reviews)
                        </span>
                      </div>
                      {provider.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {provider.bio && <p className="text-gray-600 mb-4 text-sm">{provider.bio}</p>}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.services.slice(0, 2).map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {service.service.name} - ₹{service.price}/hr
                        </span>
                      ))}
                      {provider.services.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{provider.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{provider.experience} years experience</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{provider.user.location.address}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/provider/${provider._id}`} className="btn btn-outline flex-1 text-center">
                      View Profile
                    </Link>
                    {provider.services.length > 0 && (
                      <Link
                        to={`/book/${provider._id}/${provider.services[0].service._id}`}
                        className="btn btn-primary flex-1 text-center"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searchLoading && providers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600 mb-4">
              {filters.location
                ? `No providers found in "${filters.location}". Try expanding your search area or adjusting filters.`
                : "Try adjusting your search criteria or expanding your search area"}
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters & Show All
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Providers
