import express from "express"
import Service from "../models/Service.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
    res.json(services)
  } catch (error) {
    console.error("Get services error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }
    res.json(service)
  } catch (error) {
    console.error("Get service error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const service = new Service(req.body)
    await service.save()
    res.status(201).json(service)
  } catch (error) {
    console.error("Create service error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
