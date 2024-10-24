import { useState, FormEvent } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'

export const ResetPassword = () => {
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await axios.post(`http://localhost:3333/auth/forgot-password`, {
        email
      })

      if (response.data.success) {
        alert("An email has been sent to your email address.")
        navigate('/login')
      }
    } catch (error) {
      setError("Failed to send email. Please check your email or connection.")
      console.error(error)
    }
  }

  return (
    <div>
      {/* header */}
      <div className="container mx-auto flex justify-center">
        <img src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      {/* reset password form  */}
      <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg shadow-md max-w-md mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Reset password</h2>

        {/* show error  */}
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col  w-full">
          <p className="mb-2 text-gray-700">
            Please enter your email to authenticate your account
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-4 bg-[#F1F7EC] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-700 text-base text-white font-bold rounded-lg transition duration-300"
          >
            EMAIL ME A LINK
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div >
  )
}
