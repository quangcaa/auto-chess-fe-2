import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PropTypes from "prop-types";
import bK from "/assets/piece/bK.svg";
import wK from "/assets/piece/wK.svg";
import wbK from "/assets/piece/wbK.svg";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { CREATE_GAME } from "@/constants/game";

export const CreateGameCard = ({ closeCard }) => {
  const [minutes, setMinutes] = useState(1);
  const [increment, setIncrement] = useState(0);
  const [selectedSide, setSelectedSide] = useState("random");

  const { socket } = useAuth();
  const navigate = useNavigate();

  const handleCreateGame = () => {
    const timeControl = {
      base_time: minutes, // minutes
      increment_by_turn: increment, // seconds
      name: determineTimeControlName(minutes),
      side: selectedSide,
    };

    socket.emit(CREATE_GAME, timeControl, (response) => {
      if (response.success) {
        console.log(response);
        closeCard();
      } else {
        toast.error(response.message);
      }
    });

    console.log(timeControl);
  };

  const determineTimeControlName = (minutes) => {
    if (minutes <= 3) return "Bullet";
    if (minutes <= 10) return "Blitz";
    if (minutes <= 30) return "Rapid";
    if (minutes <= 60) return "Classical";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="relative object-contain shadow-lg flex flex-col p-4">
        <button
          className="absolute top-2 right-2 bg-gray-100 rounded-full p-1 hover:bg-red-600 shadow-md focus:outline-none group"
          onClick={closeCard}
        >
          <IoClose className="size-6 group-hover:text-white" />
        </button>

        <CardHeader className="p-[21px]">
          <CardTitle className="flex justify-center text-3xl text-gray-700">
            Create a game
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <CardDescription className="flex justify-center mt-4 text-gray-600 font-medium text-md">
            Minutes per side: {minutes}
          </CardDescription>

          <div className="flex justify-center items-center mb-4">
            <div className="flex justify-center items-center w-[320px] mt-2 shadow-xl">
              <input
                type="range"
                min="1"
                max="60"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-gray-300 slider"
              />
            </div>
          </div>

          <CardDescription className="flex justify-center mt-4 text-gray-600 font-medium text-md">
            Increment in seconds: {increment}
          </CardDescription>

          <div className="flex justify-center items-center mt-1 mb-2">
            <div className="flex justify-center items-center w-[320px] mt-2 shadow-xl">
              <input
                type="range"
                min="0"
                max="60"
                value={increment}
                onChange={(e) => setIncrement(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-gray-300 slider"
              />
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 mb-2">
            <div className="flex justify-center items-center gap-4">
              <button
                className={`rounded-lg border p-2 shadow-md hover:shadow-xl ${
                  selectedSide === "black"
                    ? "border-emerald-600 border-2 bg-gray-200 hover:bg-gray-100"
                    : "bg-gray-200 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSide("black")}
              >
                <img src={bK} alt="Black" className="size-[50px]" />
              </button>
              <button
                className={`rounded-lg border p-2 shadow-md hover:shadow-xl ${
                  selectedSide === "random"
                    ? "border-emerald-600 border-2 bg-gray-200 hover:bg-gray-100"
                    : "bg-gray-200 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSide("random")}
              >
                <img src={wbK} alt="Random" className="size-[65px]" />
              </button>

              <button
                className={`rounded-lg border p-2 shadow-md hover:shadow-xl ${
                  selectedSide === "white"
                    ? "border-emerald-600 border-2 bg-gray-200 hover:bg-gray-100"
                    : "bg-gray-200 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSide("white")}
              >
                <img src={wK} alt="White" className="size-[50px]" />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-8 mb-2">
            <button
              onClick={handleCreateGame}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Start Game
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
CreateGameCard.propTypes = {
  closeCard: PropTypes.func.isRequired,
};
