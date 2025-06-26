import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { createServer } from "http"
import { Server } from "socket.io"

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import serviceRoutes from "./routes/services.js"
import providerRoutes from "./routes/providers.js"
import bookingRoutes from "./routes/bookings.js"
import reviewRoutes from "./routes/reviews.js"

dotenv.config()

const app = express()
const server = createServer(app)

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "https://fixly-local-service-finder.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean)

    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log("Blocked origin:", origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
}

const io = new Server(server, {
  cors: corsOptions,
})

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
)

app.use(cors(corsOptions))

app.options("*", cors(corsOptions))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1)
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-room", (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined room`)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

app.set("io", io)

app.get("/", (req, res) => {
  res.json({
    message: "Fixly API Server",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      services: "/api/services",
      providers: "/api/providers",
      bookings: "/api/bookings",
      reviews: "/api/reviews",
    },
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/providers", providerRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    cors: {
      allowedOrigin: process.env.CLIENT_URL,
      currentOrigin: req.get("origin"),
    },
  })
})

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    availableRoutes: [
      "GET /",
      "GET /api/health",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/services",
      "GET /api/providers/search",
    ],
  })
})

app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  console.error("Stack:", err.stack)

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS error: Origin not allowed",
      origin: req.get("origin"),
      allowedOrigins: [process.env.CLIENT_URL],
    })
  }

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fixly")
  .then(() => {
    console.log("✅ Connected to MongoDB")
    console.log("Database:", mongoose.connection.name)
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`)
  console.log(
    `📡 API Base: ${process.env.NODE_ENV === "production" ? "https://fixly-local-service-finder.onrender.com" : `http://localhost:${PORT}`}`,
  )
})

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    mongoose.connection.close()
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  server.close(() => {
    mongoose.connection.close()
    process.exit(0)
  })
})
