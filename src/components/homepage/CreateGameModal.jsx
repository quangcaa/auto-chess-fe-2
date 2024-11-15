import { useState } from "react";

const CreateGameModal = ({ isModalOpen, closeModal }) => {
  if (!isModalOpen) return null;
  const [minutes, setMinutes] = useState(5);
  const [increment, setIncrement] = useState(3);
  const [selected, setSelected] = useState("casual");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 p-8 rounded-lg relative shadow-xl transition-transform transform">
        <button
          className="absolute top-4 right-4 text-xl text-gray-600 hover:text-red-600 transition-colors"
          onClick={closeModal}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-[#4D4D4D] mb-6 text-center">
          Create a game
        </h2>

        <div className="mb-6">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row gap-2 items-center justify-center">
              <label className="block text-gray-700">Variant</label>
              <select className="px-4 py-2 border rounded-lg bg-[#FAFAF9] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option>Standard</option>
                <option>Chess960</option>
              </select>
            </div>

            <div className="flex flex-row gap-2 items-center justify-center">
              <label className="block text-gray-700">Time control</label>
              <select className="w-1/2 px-4 py-2 border rounded-lg bg-[#FAFAF9] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option>Real time</option>
                <option>Correspondence</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <label className="block text-gray-700">
                Minutes per side: {minutes}
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer hover:bg-gray-300 transition"
              />
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <label className="block text-gray-700">
                Increment in seconds: {increment}
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={increment}
                onChange={(e) => setIncrement(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer hover:bg-gray-300 transition"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mb-6">
          <button
            onClick={() => setSelected("casual")}
            className={`px-4 py-2 rounded-l-md shadow-md ${
              selected === "casual"
                ? "bg-[#629924] text-[#FFFFFF] shadow-md"
                : "bg-gray-200"
            }`}
          >
            Casual
          </button>
          <button
            onClick={() => setSelected("rated")}
            className={`px-4 py-2 rounded-r-md shadow-md ${
              selected === "rated"
                ? "bg-[#629924] text-[#FFFFFF] shadow-md"
                : "bg-gray-200"
            }`}
          >
            Rated
          </button>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="p-3 bg-gray-300 rounded-full hover:bg-gray-400 transition">
            ♔
          </button>
          <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
            ♚
          </button>
          <button className="p-3 bg-gray-300 rounded-full hover:bg-gray-400 transition">
            ♕
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGameModal;
