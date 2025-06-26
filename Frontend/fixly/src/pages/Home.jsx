import { Link } from "react-router-dom"
import { Search, Star, Shield, Clock } from "lucide-react"

const Home = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary-600" />,
      title: "Easy Search",
      description: "Find the right service provider in your area with our smart search",
    },
    {
      icon: <Star className="w-8 h-8 text-primary-600" />,
      title: "Verified Reviews",
      description: "Read authentic reviews from real customers to make informed decisions",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Trusted Providers",
      description: "All service providers are verified and background checked",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: "Flexible Scheduling",
      description: "Book appointments that fit your schedule with real-time availability",
    },
  ]

  const services = [
    { name: "Electrical", icon: "⚡", count: "150+ providers" },
    { name: "Plumbing", icon: "🔧", count: "200+ providers" },
    { name: "Tutoring", icon: "📚", count: "300+ providers" },
    { name: "Cleaning", icon: "🧹", count: "180+ providers" },
    { name: "Repair", icon: "🔨", count: "120+ providers" },
    { name: "Maintenance", icon: "⚙️", count: "90+ providers" },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Local Service Providers</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with trusted professionals for all your home and personal needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-lg text-gray-600">Choose from our wide range of professional services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={`/services?category=${service.name.toLowerCase()}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Fixly?</h2>
            <p className="text-lg text-gray-600">We make it easy to find and book trusted service providers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers who trust Fixly for their service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Sign Up Now
            </Link>
            <Link
              to="/register?role=provider"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
