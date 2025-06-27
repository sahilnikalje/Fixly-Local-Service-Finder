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
        email: "rajesh.sharma@gmail.com",
        phone: "+91 98765 43210",
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
        {
          service: { _id: "5", name: "Appliance Repair", category: "repair" },
          price: 500,
          experience: 6,
        },
      ],
      bio: "Experienced electrician with 8+ years in residential and commercial electrical work. Licensed and insured. Available for emergency repairs.",
      experience: 8,
      rating: 4.8,
      totalReviews: 47,
      isVerified: true,
      availability: {
        monday: { start: "09:00", end: "18:00", available: true },
        tuesday: { start: "09:00", end: "18:00", available: true },
        wednesday: { start: "09:00", end: "18:00", available: true },
        thursday: { start: "09:00", end: "18:00", available: true },
        friday: { start: "09:00", end: "18:00", available: true },
        saturday: { start: "10:00", end: "16:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false },
      },
    },
    {
      _id: "2",
      user: {
        _id: "2",
        name: "Priya Patil",
        email: "priya.patil@gmail.com",
        phone: "+91 87654 32109",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Baner, Pune, Maharashtra 411045",
        },
      },
      services: [
        {
          service: { _id: "2", name: "Plumbing Services", category: "plumbing" },
          price: 400,
          experience: 5,
        },
      ],
      bio: "Professional plumber specializing in residential repairs and installations. Quick response for emergency plumbing issues. Eco-friendly solutions.",
      experience: 5,
      rating: 4.6,
      totalReviews: 32,
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
      _id: "3",
      user: {
        _id: "3",
        name: "Amit Joshi",
        email: "amit.joshi@gmail.com",
        phone: "+91 76543 21098",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Shivaji Nagar, Pune, Maharashtra 411005",
        },
      },
      services: [
        {
          service: { _id: "3", name: "Math Tutoring", category: "tutoring" },
          price: 300,
          experience: 10,
        },
      ],
      bio: "M.Tech graduate with 10 years of tutoring experience. Specializing in 10th, 12th, and engineering mathematics. Online and offline classes available.",
      experience: 10,
      rating: 4.9,
      totalReviews: 68,
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
        name: "Sunita Desai",
        email: "sunita.desai@gmail.com",
        phone: "+91 65432 10987",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Wakad, Pune, Maharashtra 411057",
        },
      },
      services: [
        {
          service: { _id: "4", name: "House Cleaning", category: "cleaning" },
          price: 250,
          experience: 6,
        },
      ],
      bio: "Professional house cleaning service with eco-friendly products. Reliable, thorough, and trustworthy. Deep cleaning and regular maintenance available.",
      experience: 6,
      rating: 4.7,
      totalReviews: 54,
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
        name: "Vikram Kulkarni",
        email: "vikram.kulkarni@gmail.com",
        phone: "+91 54321 09876",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Hinjewadi, Pune, Maharashtra 411057",
        },
      },
      services: [
        {
          service: { _id: "5", name: "Appliance Repair", category: "repair" },
          price: 350,
          experience: 7,
        },
        {
          service: { _id: "6", name: "General Maintenance", category: "maintenance" },
          price: 300,
          experience: 7,
        },
      ],
      bio: "Skilled technician for appliance repair and general maintenance. Quick diagnosis and fair pricing. Specializes in AC, washing machine, and refrigerator repairs.",
      experience: 7,
      rating: 4.5,
      totalReviews: 41,
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
        email: "kavita.bhosale@gmail.com",
        phone: "+91 43210 98765",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Kothrud, Pune, Maharashtra 411038",
        },
      },
      services: [
        {
          service: { _id: "3", name: "English Tutoring", category: "tutoring" },
          price: 250,
          experience: 8,
        },
      ],
      bio: "English teacher with M.A. in English Literature. 8 years of experience in spoken English, grammar, and competitive exam preparation. IELTS/TOEFL coaching available.",
      experience: 8,
      rating: 4.8,
      totalReviews: 36,
      isVerified: true,
      availability: {
        monday: { start: "17:00", end: "20:00", available: true },
        tuesday: { start: "17:00", end: "20:00", available: true },
        wednesday: { start: "17:00", end: "20:00", available: true },
        thursday: { start: "17:00", end: "20:00", available: true },
        friday: { start: "17:00", end: "20:00", available: true },
        saturday: { start: "14:00", end: "18:00", available: true },
        sunday: { start: "14:00", end: "18:00", available: true },
      },
    },
    {
      _id: "7",
      user: {
        _id: "7",
        name: "Sachin Pawar",
        email: "sachin.pawar@gmail.com",
        phone: "+91 32109 87654",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Pimpri-Chinchwad, Pune, Maharashtra 411018",
        },
      },
      services: [
        {
          service: { _id: "1", name: "Electrical Repair", category: "electrical" },
          price: 400,
          experience: 6,
        },
      ],
      bio: "Licensed electrician specializing in home automation, LED installations, and electrical safety audits. Quick response for power outages and electrical emergencies.",
      experience: 6,
      rating: 4.4,
      totalReviews: 28,
      isVerified: true,
      availability: {
        monday: { start: "09:00", end: "18:00", available: true },
        tuesday: { start: "09:00", end: "18:00", available: true },
        wednesday: { start: "09:00", end: "18:00", available: true },
        thursday: { start: "09:00", end: "18:00", available: true },
        friday: { start: "09:00", end: "18:00", available: true },
        saturday: { start: "10:00", end: "16:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false },
      },
    },
    {
      _id: "8",
      user: {
        _id: "8",
        name: "Meera Jadhav",
        email: "meera.jadhav@gmail.com",
        phone: "+91 21098 76543",
        avatar: "",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Aundh, Pune, Maharashtra 411007",
        },
      },
      services: [
        {
          service: { _id: "4", name: "House Cleaning", category: "cleaning" },
          price: 200,
          experience: 4,
        },
      ],
      bio: "Experienced in residential and office cleaning. Uses eco-friendly cleaning products. Flexible timing and competitive rates. Deep cleaning specialist.",
      experience: 4,
      rating: 4.6,
      totalReviews: 22,
      isVerified: true,
      availability: {
        monday: { start: "08:00", end: "16:00", available: true },
        tuesday: { start: "08:00", end: "16:00", available: true },
        wednesday: { start: "08:00", end: "16:00", available: true },
        thursday: { start: "08:00", end: "16:00", available: true },
        friday: { start: "08:00", end: "16:00", available: true },
        saturday: { start: "09:00", end: "15:00", available: true },
        sunday: { start: "09:00", end: "15:00", available: false },
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
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
      const response = await axios.get(`${API_URL}/api/services`)
      setServices(response.data)
    } catch (error) {
      console.log("Using mock data for services")
      setServices(mockServices)
    }
  }

  const fetchProviders = async () => {
    try {
      setSearchLoading(true)
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
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

      const response = await axios.get(`${API_URL}/api/providers/search?${params}`)
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
      koregaon: { lat: "18.5362", lng: "73.8958" },
      baner: { lat: "18.5679", lng: "73.7781" },
      "shivaji nagar": { lat: "18.5309", lng: "73.8475" },
      wakad: { lat: "18.5975", lng: "73.7898" },
      hinjewadi: { lat: "18.5912", lng: "73.7389" },
      kothrud: { lat: "18.5074", lng: "73.8077" },
      "pimpri chinchwad": { lat: "18.6298", lng: "73.7997" },
      aundh: { lat: "18.5593", lng: "73.8078" },
      411001: { lat: "18.5204", lng: "73.8567" },
      411045: { lat: "18.5679", lng: "73.7781" },
      411005: { lat: "18.5309", lng: "73.8475" },
      411057: { lat: "18.5975", lng: "73.7898" },
      411038: { lat: "18.5074", lng: "73.8077" },
      411018: { lat: "18.6298", lng: "73.7997" },
      411007: { lat: "18.5593", lng: "73.8078" },
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
