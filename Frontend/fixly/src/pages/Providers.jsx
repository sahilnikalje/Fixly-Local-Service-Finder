"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { MapPin, Star, Clock } from "lucide-react"
import axios from "axios"

const Providers = () => {
  const [searchParams] = useSearchParams()
  const [providers, setProviders] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    service: searchParams.get("service") || "",
    location: "",
    radius: 10,
    minRating: 0,
  })

  useEffect(() => {
    fetchServices()
    fetchProviders()
  }, [])

  useEffect(() => {
    fetchProviders()
  }, [filters])

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services")
      setServices(response.data)
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.service) params.append("service", filters.service)
      if (filters.location) {
        params.append("lat", "40.7128")
        params.append("lng", "-74.0060")
        params.append("radius", filters.radius)
      }

      const response = await axios.get(`/api/providers/search?${params}`)
      let filteredProviders = response.data

      if (filters.minRating > 0) {
        filteredProviders = filteredProviders.filter((provider) => provider.rating >= filters.minRating)
      }

      setProviders(filteredProviders)
    } catch (error) {
      console.error("Error fetching providers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Providers</h1>
          <p className="text-lg text-gray-600">Find trusted professionals in your area</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                placeholder="Enter city or zip code"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Radius (miles)</label>
              <select
                className="input w-full"
                value={filters.radius}
                onChange={(e) => handleFilterChange("radius", Number.parseInt(e.target.value))}
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
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
          </div>
        </div>
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
                  </div>
                </div>

                {provider.bio && <p className="text-gray-600 mb-4 text-sm">{provider.bio}</p>}

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        {getServiceName(service.service)} - ${service.price}/hr
                      </span>
                    ))}
                    {provider.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{provider.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{provider.experience} years experience</span>
                </div>

                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{provider.user.location.address || "Location not specified"}</span>
                </div>

                <div className="flex gap-2">
                  <Link to={`/provider/${provider._id}`} className="btn btn-outline flex-1 text-center">
                    View Profile
                  </Link>
                  {provider.services.length > 0 && (
                    <Link
                      to={`/book/${provider._id}/${provider.services[0].service}`}
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

        {providers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or expanding your search area</p>
            <button
              onClick={() =>
                setFilters({
                  service: "",
                  location: "",
                  radius: 10,
                  minRating: 0,
                })
              }
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Providers
