"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, MapPin } from "lucide-react"
import axios from "axios"

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const categories = [
    { value: "", label: "All Categories" },
    { value: "electrical", label: "Electrical" },
    { value: "plumbing", label: "Plumbing" },
    { value: "tutoring", label: "Tutoring" },
    { value: "cleaning", label: "Cleaning" },
    { value: "repair", label: "Repair" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" },
  ]

  const mockServices = [
    {
      _id: "1",
      name: "Electrical Repair",
      description: "Professional electrical repair and installation services",
      category: "electrical",
      basePrice: 75,
      icon: "⚡",
    },
    {
      _id: "2",
      name: "Plumbing Services",
      description: "Expert plumbing repair and maintenance",
      category: "plumbing",
      basePrice: 65,
      icon: "🔧",
    },
    {
      _id: "3",
      name: "Math Tutoring",
      description: "Professional math tutoring for all levels",
      category: "tutoring",
      basePrice: 40,
      icon: "📚",
    },
    {
      _id: "4",
      name: "House Cleaning",
      description: "Professional house cleaning services",
      category: "cleaning",
      basePrice: 50,
      icon: "🧹",
    },
    {
      _id: "5",
      name: "Appliance Repair",
      description: "Repair services for home appliances",
      category: "repair",
      basePrice: 80,
      icon: "🔨",
    },
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchTerm, selectedCategory])

  const fetchServices = async () => {
    try {
      const fullUrl = `${API_URL}/api/services`
      console.log("🔗 Fetching services from:", fullUrl)

      const response = await axios.get(fullUrl)
      console.log("✅ Services fetched successfully:", response.data)
      setServices(response.data)
    } catch (error) {
      console.error("❌ Services API error:", error)
      console.error("❌ Using mock data for services")
      setServices(mockServices)
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = services

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    setFilteredServices(filtered)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (category) {
      setSearchParams({ category })
    } else {
      setSearchParams({})
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      electrical: "⚡",
      plumbing: "🔧",
      tutoring: "📚",
      cleaning: "🧹",
      repair: "🔨",
      maintenance: "⚙️",
      other: "🛠️",
    }
    return icons[category] || "🛠️"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">Find the perfect service for your needs</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-64">
              <select
                className="input w-full"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service._id} className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{getCategoryIcon(service.category)}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{service.category}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{service.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${service.basePrice}
                    <span className="text-sm font-normal text-gray-500">/hour</span>
                  </span>
                </div>

                <Link
                  to={`/providers?service=${service._id}`}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Providers
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("")
                setSearchParams({})
              }}
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

export default Services
