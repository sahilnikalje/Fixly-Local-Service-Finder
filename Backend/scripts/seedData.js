import mongoose from "mongoose"
import dotenv from "dotenv"
import Service from "../models/Service.js"
import User from "../models/User.js"
import Provider from "../models/Provider.js"

dotenv.config()

const services = [
  {
    name: "Electrical Repair",
    description: "Professional electrical repair and installation services",
    category: "electrical",
    basePrice: 450,
    icon: "⚡",
  },
  {
    name: "Plumbing Services",
    description: "Expert plumbing repair and maintenance",
    category: "plumbing",
    basePrice: 400,
    icon: "🔧",
  },
  {
    name: "Math Tutoring",
    description: "Professional math tutoring for all levels",
    category: "tutoring",
    basePrice: 300,
    icon: "📚",
  },
  {
    name: "House Cleaning",
    description: "Professional house cleaning services",
    category: "cleaning",
    basePrice: 250,
    icon: "🧹",
  },
  {
    name: "Appliance Repair",
    description: "Repair services for home appliances",
    category: "repair",
    basePrice: 350,
    icon: "🔨",
  },
]

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fixly")
    console.log("Connected to MongoDB")

    await Service.deleteMany({})
    await User.deleteMany({})
    await Provider.deleteMany({})

    const createdServices = await Service.insertMany(services)
    console.log("Services created:", createdServices.length)

    const sampleUsers = [
      {
        name: "Rajesh Sharma",
        email: "rajesh.sharma@gmail.com",
        password: "password123",
        phone: "+91 98765 43210",
        role: "provider",
        location: {
          coordinates: [73.8567, 18.5204], // Pune coordinates
          address: "Koregaon Park, Pune, Maharashtra 411001",
        },
      },
      {
        name: "Priya Patil",
        email: "priya.patil@gmail.com",
        password: "password123",
        phone: "+91 87654 32109",
        role: "provider",
        location: {
          coordinates: [73.7781, 18.5679],
          address: "Baner, Pune, Maharashtra 411045",
        },
      },
      {
        name: "Customer User",
        email: "customer@gmail.com",
        password: "password123",
        phone: "+91 76543 21098",
        role: "customer",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Shivaji Nagar, Pune, Maharashtra 411005",
        },
      },
    ]

    const createdUsers = await User.insertMany(sampleUsers)
    console.log("Users created:", createdUsers.length)

    const electricianUser = createdUsers.find((u) => u.name === "Rajesh Sharma")
    const plumberUser = createdUsers.find((u) => u.name === "Priya Patil")
    const electricalService = createdServices.find((s) => s.category === "electrical")
    const plumbingService = createdServices.find((s) => s.category === "plumbing")

    const providers = [
      {
        user: electricianUser._id,
        services: [
          {
            service: electricalService._id,
            price: 450,
            experience: 8,
          },
        ],
        bio: "Experienced electrician with 8+ years in residential and commercial electrical work. Licensed and insured.",
        experience: 8,
        rating: 4.8,
        totalReviews: 47,
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
        user: plumberUser._id,
        services: [
          {
            service: plumbingService._id,
            price: 400,
            experience: 5,
          },
        ],
        bio: "Professional plumber specializing in residential repairs and installations. Quick response for emergency plumbing issues.",
        experience: 5,
        rating: 4.6,
        totalReviews: 32,
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
    ]

    await Provider.insertMany(providers)
    console.log("Providers created:", providers.length)

    console.log("Seed data created successfully with Pune providers!")
    process.exit(0)
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seedData()
