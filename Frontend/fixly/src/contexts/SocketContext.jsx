"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuth } from "./AuthContext"
import toast from "react-hot-toast"

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        transports: ["websocket", "polling"],
        timeout: 20000,
      })

      newSocket.on("connect", () => {
        console.log("Connected to server")
        setConnected(true)
        newSocket.emit("join-room", user.id)
      })

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server")
        setConnected(false)
      })

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error)
        setConnected(false)
      })

      newSocket.on("new-booking", (booking) => {
        toast.success("New booking received!")
      })

      newSocket.on("booking-updated", (booking) => {
        toast.success("Booking status updated!")
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
        setSocket(null)
        setConnected(false)
      }
    }
  }, [user])

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>
}
