import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      const res = await axios.post(`http://localhost:3333/auth/logout`,
        {},
        {
          headers: {
            x_authorization: localStorage.getItem("accessToken") || "",
          },
        }
      )

      if (res.data.success) {
        logout()
        navigate("/login")
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred during login")
      } else {
        setError("An error occurred during login")
      }
    }
  }

  return <button onClick={handleLogout}>Logout</button>
}