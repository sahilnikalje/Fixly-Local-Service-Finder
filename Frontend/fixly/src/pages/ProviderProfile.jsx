"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Star, MapPin, Clock, Phone, Mail, Award } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const ProviderProfile = () => {
  const { api } = useAuth()
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchProviderData()
  }, [id])

  const fetchProviderData = async () => {
    try {
      console.log("Fetching provider profile data...")
      const [providerResponse, reviewsResponse] = await Promise.all([
        api.get(`/api/providers/${id}`),
        api.get(`/api/reviews/provider/${id}`),
      ])

      setProvider(providerResponse.data)
      setReviews(reviewsResponse.data)
    } catch (error) {
      console.error("Error fetching provider data:", error)
      const mockProviders = {
        1: {
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
              service: { _id: "1", name: "Electrical Repair", description: "Professional electrical services" },
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
        2: {
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
              service: { _id: "2", name: "Plumbing Services", description: "Expert plumbing repair and maintenance" },
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
        3: {
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
              service: { _id: "3", name: "Math Tutoring", description: "Professional math tutoring for all levels" },
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
      }

      const mockReviews = [
        {
          _id: "1",
          customer: { name: "Arjun Desai", avatar: "" },
          rating: 5,
          comment: "Excellent service! Very professional and completed the work quickly. Highly recommended!",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          customer: { name: "Sneha Joshi", avatar: "" },
          rating: 4,
          comment: "Good work, arrived on time and fixed the issue. Fair pricing.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          _id: "3",
          customer: { name: "Rahul Mehta", avatar: "" },
          rating: 5,
          comment: "Outstanding service! Very knowledgeable and explained everything clearly.",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]

      const mockProvider = mockProviders[id]
      if (mockProvider) {
        setProvider(mockProvider)
        setReviews(mockReviews)
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider not found</h2>
          <Link to="/providers" className="btn btn-primary">
            Back to Providers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              {provider.user.avatar ? (
                <img
                  src={provider.user.avatar || "/placeholder.svg"}
                  alt={provider.user.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-semibold text-gray-600">
                  {provider.user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.user.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-3">{renderStars(Math.floor(provider.rating))}</div>
                <span className="text-lg font-medium text-gray-900">{provider.rating.toFixed(1)}</span>
                <span className="text-gray-600 ml-2">({provider.totalReviews} reviews)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{provider.user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{provider.user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{provider.user.location.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{provider.experience} years experience</span>
                </div>
              </div>

              {provider.isVerified && (
                <div className="flex items-center text-green-600 mb-4">
                  <Award className="w-5 h-5 mr-2" />
                  <span className="font-medium">Verified Provider</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {provider.services.length > 0 && (
                <Link
                  to={`/book/${provider._id}/${provider.services[0].service._id}`}
                  className="btn btn-primary px-8 py-3 text-lg"
                >
                  Book Service
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {["overview", "services", "reviews", "portfolio"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {provider.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-600">{provider.bio}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(provider.availability || {}).map(([day, schedule]) => (
                      <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-gray-600">
                          {schedule.available ? `${schedule.start} - ${schedule.end}` : "Unavailable"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{service.service.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{service.service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary-600">₹{service.price}/hr</span>
                        <Link to={`/book/${provider._id}/${service.service._id}`} className="btn btn-primary btn-sm">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              {review.customer.avatar ? (
                                <img
                                  src={review.customer.avatar || "/placeholder.svg"}
                                  alt={review.customer.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-semibold text-gray-600">
                                  {review.customer.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.customer.name}</p>
                              <div className="flex items-center">{renderStars(review.rating)}</div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "portfolio" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
                {provider.portfolio && provider.portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {provider.portfolio.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No portfolio items available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderProfile
