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
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL ,
    methods: ["GET", "POST"],
  },
})

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL ,
    credentials: true,
  }),
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
})
app.use(limiter)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Socket.IO connection handling
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

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/providers", providerRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)

// for health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fixly")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
