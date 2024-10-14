import { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const VerifyEmail = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Tự động chuyển đến ô tiếp theo nếu đã nhập xong 1 số
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleSubmit = async () => {
    const enteredCode = code.join('');
    console.log("Code entered:", enteredCode);
    try {
        const response = await axios.post(`http://localhost:3333/auth/verify-email`, {
            code
        });
        if (response.data.success) {
            alert("An email has been sent to your address for password reset.");
            navigate('/login');
          }
    } catch (error) {
        setError("Failed to send email. Please check your email or network connection.");
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
        <h2 className="text-2xl font-bold mb-4 text-center">Verify your email</h2>
        <p className="text-gray-600 mb-6 text-center">Enter the 6-digit code sent to your email address</p>
        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index)}
              className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Verify email
        </button>
      </div>
    </div>
    </div>
  );
};


