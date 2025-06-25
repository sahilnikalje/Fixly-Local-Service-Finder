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
    basePrice: 75,
    icon: "⚡",
  },
  {
    name: "Plumbing Services",
    description: "Expert plumbing repair and maintenance",
    category: "plumbing",
    basePrice: 65,
    icon: "🔧",
  },
  {
    name: "Math Tutoring",
    description: "Professional math tutoring for all levels",
    category: "tutoring",
    basePrice: 40,
    icon: "📚",
  },
  {
    name: "House Cleaning",
    description: "Professional house cleaning services",
    category: "cleaning",
    basePrice: 50,
    icon: "🧹",
  },
  {
    name: "Appliance Repair",
    description: "Repair services for home appliances",
    category: "repair",
    basePrice: 80,
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
        name: "Rahul Electrician",
        email: "rahul@example.com",
        password: "password123",
        phone: "+919876543210",
        role: "provider",
        location: {
          coordinates: [73.8567, 18.5204], // Pune
          address: "Pune, India",
        },
      },
      {
        name: "Priya Customer",
        email: "priya@example.com",
        password: "password123",
        phone: "+919876543211",
        role: "customer",
        location: {
          coordinates: [73.8567, 18.5204],
          address: "Pune, India",
        },
      },
    ]

    const createdUsers = await User.insertMany(sampleUsers)
    console.log("Users created:", createdUsers.length)

    const electricianUser = createdUsers.find((u) => u.role === "provider")
    const electricalService = createdServices.find((s) => s.category === "electrical")

    const provider = new Provider({
      user: electricianUser._id,
      services: [
        {
          service: electricalService._id,
          price: 85,
          experience: 5,
        },
      ],
      bio: "Experienced electrician with 5+ years in residential and commercial electrical work.",
      experience: 5,
      availability: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "10:00", end: "15:00", available: true },
        sunday: { start: "10:00", end: "15:00", available: false },
      },
    })

    await provider.save()
    console.log("Provider created")

    console.log("Seed data created successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seedData()
