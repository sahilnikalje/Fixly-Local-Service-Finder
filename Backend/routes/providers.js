import express from "express"
import Provider from "../models/Provider.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.get("/search", async (req, res) => {
  try {
    const { service, lat, lng, radius = 10 } = req.query

    const query = { isActive: true }

    if (service) {
      query["services.service"] = service
    }

    let providers = await Provider.find(query)
      .populate("user", "name email phone avatar location")
      .populate("services.service", "name category")

    if (lat && lng) {
      const radiusInRadians = radius / 3963.2 // Convert miles to radians

      providers = providers.filter((provider) => {
        if (!provider.user || !provider.user.location || !provider.user.location.coordinates) {
          return false
        }

        const [providerLng, providerLat] = provider.user.location.coordinates
        const distance = Math.acos(
          Math.sin((lat * Math.PI) / 180) * Math.sin((providerLat * Math.PI) / 180) +
            Math.cos((lat * Math.PI) / 180) *
              Math.cos((providerLat * Math.PI) / 180) *
              Math.cos(((lng - providerLng) * Math.PI) / 180),
        )
        return distance <= radiusInRadians
      })
    }

    res.json(providers)
  } catch (error) {
    console.error("Search providers error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("user", "name email phone avatar location")
      .populate("services.service", "name category description")

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" })
    }

    res.json(provider)
  } catch (error) {
    console.error("Get provider error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/profile/me", authenticate, async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id })
      .populate("user", "name email phone avatar location")
      .populate("services.service", "name category description")

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" })
    }

    res.json(provider)
  } catch (error) {
    console.error("Get provider profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/profile", authenticate, async (req, res) => {
  try {
    const existingProvider = await Provider.findOne({ user: req.user.id })

    if (existingProvider) {
      Object.assign(existingProvider, req.body)
      await existingProvider.save()

      const updatedProvider = await Provider.findById(existingProvider._id)
        .populate("user", "name email phone avatar location")
        .populate("services.service", "name category description")

      res.json(updatedProvider)
    } else {
      const provider = new Provider({
        user: req.user.id,
        ...req.body,
      })
      await provider.save()

      const newProvider = await Provider.findById(provider._id)
        .populate("user", "name email phone avatar location")
        .populate("services.service", "name category description")

      res.status(201).json(newProvider)
    }
  } catch (error) {
    console.error("Create/Update provider error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.patch("/availability", authenticate, async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id })

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" })
    }

    provider.availability = req.body.availability
    await provider.save()

    const updatedProvider = await Provider.findById(provider._id)
      .populate("user", "name email phone avatar location")
      .populate("services.service", "name category description")

    res.json(updatedProvider)
  } catch (error) {
    console.error("Update availability error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
