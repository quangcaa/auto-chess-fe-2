import React from "react"
import { AxiosError } from "axios"
import api from "../../lib/axios"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      const res = await api.post('/auth/logout')

      if (res.data.success) {
        logout()
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    }

  }

  return <button onClick={handleLogout}>Logout</button>
}