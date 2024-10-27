import React, { useState } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/axios"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.post('/auth/login', {
        username,
        password
      })
      const data = res.data

      toast.success('Logged in successfully')

      login(data.accessToken, data.refreshToken, data.user.username)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div >
      {/* header */}
      <div className="container mx-auto flex justify-center">
        <img
          src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      {/* login form */}
      <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg shadow-md max-w-md mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-[#F1F7EC] border border-[#ddd] rounded-lg w-full p-3 mb-3 transition duration-300 focus:border-[#007bff] focus:outline-none focus:ring focus:ring-[#007bff] focus:ring-opacity-30"
          />

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#F1F7EC] border border-[#ddd] rounded-lg w-full p-3 pr-12 transition duration-300 focus:border-[#007bff] focus:outline-none focus:ring focus:ring-[#007bff] focus:ring-opacity-30"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-lg text-[#555]"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className={`mt-3 w-full py-3 bg-blue-500 hover:bg-blue-700 text-base text-white font-bold rounded-lg transition duration-300 ${loading
              ? "bg-blue-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>

        </form>

        <div className="mt-5 flex justify-between">
          <Link to="/register" className="text-[#007bff] hover:underline mr-10">
            Register
          </Link>
          <Link to="/reset-password" className="text-[#007bff] hover:underline">
            Reset password
          </Link>
        </div>

      </div>
    </div>
  )
}