import mongoose from "mongoose"
import dotenv from "dotenv"
import Service from "../models/Service.js"
import User from "../models/User.js"
import Provider from "../models/Provider.js"

dotenv.config()

const sampleProviders = [
  {
    name: "Rajesh Sharma",
    email: "rajesh.electrician@example.com",
    password: "password123",
    phone: "+919876543210",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Koregaon Park, Pune, Maharashtra 411001",
    },
    services: ["electrical"],
    bio: "Experienced electrician with 8+ years in residential and commercial electrical work. Licensed and certified by Maharashtra Electrical Board.",
    experience: 8,
    price: 450,
  },
  {
    name: "Priya Patil",
    email: "priya.plumber@example.com",
    password: "password123",
    phone: "+919876543211",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Baner, Pune, Maharashtra 411045",
    },
    services: ["plumbing"],
    bio: "Professional plumber specializing in residential repairs and installations. Expert in modern plumbing systems and water conservation.",
    experience: 5,
    price: 350,
  },
  {
    name: "Amit Kulkarni",
    email: "amit.tutor@example.com",
    password: "password123",
    phone: "+919876543212",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Shivajinagar, Pune, Maharashtra 411005",
    },
    services: ["tutoring"],
    bio: "M.Tech graduate with 10 years of tutoring experience. Specializing in Mathematics, Physics, and Engineering subjects for 10th-12th and competitive exams.",
    experience: 10,
    price: 800,
  },
  {
    name: "Sunita Deshmukh",
    email: "sunita.cleaner@example.com",
    password: "password123",
    phone: "+919876543213",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Wakad, Pune, Maharashtra 411057",
    },
    services: ["cleaning"],
    bio: "Professional house cleaning service with eco-friendly products. Specialized in deep cleaning, sanitization, and home organization.",
    experience: 6,
    price: 300,
  },
  {
    name: "Vikram Joshi",
    email: "vikram.handyman@example.com",
    password: "password123",
    phone: "+919876543214",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Hinjewadi, Pune, Maharashtra 411057",
    },
    services: ["repair", "maintenance"],
    bio: "Skilled handyman offering appliance repair and general maintenance services. Expert in AC repair, washing machine service, and home maintenance.",
    experience: 12,
    price: 400,
  },
  {
    name: "Kavita Bhosale",
    email: "kavita.tutor@example.com",
    password: "password123",
    phone: "+919876543215",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Kothrud, Pune, Maharashtra 411038",
    },
    services: ["tutoring"],
    bio: "B.Ed qualified teacher with 8 years experience in teaching English, Hindi, and Marathi. Specialized in primary and secondary education.",
    experience: 8,
    price: 600,
  },
  {
    name: "Suresh Pawar",
    email: "suresh.electrician@example.com",
    password: "password123",
    phone: "+919876543216",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Pimpri-Chinchwad, Pune, Maharashtra 411018",
    },
    services: ["electrical"],
    bio: "Senior electrician with 15+ years experience. Specialized in industrial and residential electrical installations, solar panel setup, and electrical safety audits.",
    experience: 15,
    price: 500,
  },
  {
    name: "Meera Jadhav",
    email: "meera.cleaner@example.com",
    password: "password123",
    phone: "+919876543217",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Aundh, Pune, Maharashtra 411007",
    },
    services: ["cleaning"],
    bio: "Professional cleaning service provider with trained staff. Offering residential and commercial cleaning, carpet cleaning, and post-construction cleanup.",
    experience: 4,
    price: 280,
  },
  {
    name: "Ganesh Mane",
    email: "ganesh.plumber@example.com",
    password: "password123",
    phone: "+919876543218",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Hadapsar, Pune, Maharashtra 411028",
    },
    services: ["plumbing"],
    bio: "Expert plumber with 7 years experience in residential and commercial plumbing. Specialized in bathroom renovation, pipeline installation, and water heater services.",
    experience: 7,
    price: 380,
  },
  {
    name: "Anita Raut",
    email: "anita.tutor@example.com",
    password: "password123",
    phone: "+919876543219",
    role: "provider",
    location: {
      coordinates: [73.8567, 18.5204],
      address: "Viman Nagar, Pune, Maharashtra 411014",
    },
    services: ["tutoring"],
    bio: "PhD in Computer Science with 12 years teaching experience. Specialized in programming languages, data structures, and competitive programming coaching.",
    experience: 12,
    price: 1200,
  },
]

async function seedProviders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fixly")
    console.log("Connected to MongoDB")

    const services = await Service.find()
    const serviceMap = {}
    services.forEach((service) => {
      serviceMap[service.category] = service._id
    })

    console.log("Available services:", serviceMap)

    for (const providerData of sampleProviders) {
      const existingUser = await User.findOne({ email: providerData.email })
      if (existingUser) {
        console.log(`User ${providerData.email} already exists, skipping...`)
        continue
      }

      const user = new User({
        name: providerData.name,
        email: providerData.email,
        password: providerData.password,
        phone: providerData.phone,
        role: providerData.role,
        location: providerData.location,
        isVerified: true,
        isActive: true,
      })

      await user.save()
      console.log(`Created user: ${user.name}`)

      const providerServices = providerData.services
        .map((serviceCategory) => {
          const serviceId = serviceMap[serviceCategory]
          if (!serviceId) {
            console.log(`Service not found for category: ${serviceCategory}`)
            return null
          }
          return {
            service: serviceId,
            price: providerData.price,
            experience: providerData.experience,
          }
        })
        .filter(Boolean)

      if (providerServices.length === 0) {
        console.log(`No valid services found for ${providerData.name}, skipping provider creation`)
        continue
      }

      const provider = new Provider({
        user: user._id,
        services: providerServices,
        bio: providerData.bio,
        experience: providerData.experience,
        rating: 4.2 + Math.random() * 0.8, 
        totalReviews: Math.floor(Math.random() * 80) + 15, 
        availability: {
          monday: { start: "09:00", end: "18:00", available: true },
          tuesday: { start: "09:00", end: "18:00", available: true },
          wednesday: { start: "09:00", end: "18:00", available: true },
          thursday: { start: "09:00", end: "18:00", available: true },
          friday: { start: "09:00", end: "18:00", available: true },
          saturday: { start: "10:00", end: "17:00", available: true },
          sunday: { start: "10:00", end: "16:00", available: false },
        },
        isVerified: true,
        isActive: true,
      })

      await provider.save()
      console.log(`Created provider profile for: ${user.name}`)
    }

    console.log("Provider seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seedProviders()
