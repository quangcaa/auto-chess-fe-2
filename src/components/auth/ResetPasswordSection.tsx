import { useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/axios"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const ResetPassword = () => {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })

      toast.success('Sent reset password link to your email successfully')
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
            className={`w-full py-3 bg-blue-500 hover:bg-blue-700 text-base text-white font-bold rounded-lg transition duration-300 ${loading
              ? "bg-blue-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            disabled={loading}
          >
            {loading ? "SENDING..." : "SEND"}
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
