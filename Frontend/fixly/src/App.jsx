"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Services from "./pages/Services"
import Providers from "./pages/Providers"
import ProviderProfile from "./pages/ProviderProfile"
import Bookings from "./pages/Bookings"
import BookingForm from "./pages/BookingForm"
import Profile from "./pages/Profile"
import ProviderDashboard from "./pages/ProviderDashboard"
import ReviewForm from "./pages/ReviewForm"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="providers" element={<Providers />} />
        <Route path="provider/:id" element={<ProviderProfile />} />
        <Route path="login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="bookings" element={user ? <Bookings /> : <Navigate to="/login" />} />
        <Route path="profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route
          path="provider-dashboard"
          element={user?.role === "provider" ? <ProviderDashboard /> : <Navigate to="/dashboard" />}
        />
        <Route path="book/:providerId/:serviceId" element={user ? <BookingForm /> : <Navigate to="/login" />} />
        <Route path="book/:providerId" element={user ? <BookingForm /> : <Navigate to="/login" />} />
        <Route path="review/:bookingId" element={user ? <ReviewForm /> : <Navigate to="/login" />} />
        <Route path="services/:category" element={<Services />} />
        <Route path="providers/search" element={<Providers />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default App
