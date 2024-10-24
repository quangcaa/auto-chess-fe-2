import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"

// interface RegisterProps {
//   onRegister: (status: boolean) => void
// }

export const Register = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(`http://localhost:3333/auth/signup`, {
        username,
        email,
        password
      })

      if (response.data.success) {
        // onRegister(true)
        login(response.data.accessToken, username)
        navigate('/verify-email')
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred during login")
      } else {
        setError("An error occurred during login")
      }

    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLoginRedirect = () => {
    navigate('/login')
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

      {/* register form */}
      <div className="bg-white flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-md max-w-md mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>

        {/* show error  */}
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-[#F1F7EC] w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <div className="relative flex items-center my-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#F1F7EC] w-full my-1 p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
            />
            <span
              className="absolute right-3 cursor-pointer text-gray-600 text-lg"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#F1F7EC] w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            type="submit"
            className="mt-3 w-full py-3 bg-blue-500 hover:bg-blue-700 text-base text-white font-bold rounded-lg transition duration-300"
          >
            REGISTER
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 cursor-pointer" onClick={handleLoginRedirect}>
          Already have an account? <span className="text-blue-500 hover:underline">Login</span>
        </p>
      </div>
    </div>
  )
}