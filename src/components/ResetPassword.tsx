import { useState, FormEvent } from "react";
import axios from "axios"; // Nhớ import axios
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3333/auth/forgot-password`, {
        email
      });

      if (response.data.success) {
        alert("An email has been sent to your address for password reset.");
        navigate('/login');
      }
    } catch (error) {
      setError("Failed to send email. Please check your email or connection.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="container mx-auto flex justify-center">
        <img src="autochess-logo.png" className="h-auto w-auto mix-blend-darken" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-8 -mt-20">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full ">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <p className="mb-4 text-gray-600">
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
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Email me a link
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
