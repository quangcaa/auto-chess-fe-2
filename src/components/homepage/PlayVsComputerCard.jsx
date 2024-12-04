import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios";

import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import bK from "/assets/piece/bK.svg";
import wK from "/assets/piece/wK.svg";
import wbK from "/assets/piece/wbK.svg";

export const PlayVsComputerCard = ({ closeCard }) => {
  const [selectedStrength, setSelectedStrength] = useState(1);
  const [selectedSide, setSelectedSide] = useState(null);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    let pickedSide = selectedSide;

    if (selectedSide === "random") {
      const sides = ["white", "black"];
      pickedSide = sides[Math.floor(Math.random() * sides.length)];
      setSelectedSide(pickedSide);
    }

    try {
      const res = await api.post("/game/create-computer", {
        strength: selectedStrength,
        side: pickedSide,
      });

      const { game_id } = res.data;

      navigate(`/computer/${game_id}`);
    } catch (error) {
      toast.error(error.res.data.message || "Something went wrong");
    }

    closeCard();
  };

  // const selectRandomOptions = () => {
  //     const randomStrength = Math.floor(Math.random() * 8) + 1;
  //     const sides = ["white", "black", "random"];
  //     const randomSide = sides[Math.floor(Math.random() * sides.length)];
  //     setSelectedStrength(randomStrength);
  //     setSelectedSide(randomSide);
  // };

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
            Play with the computer
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <CardDescription className="flex justify-center mt-4 text-gray-600 font-medium text-md">
            Strength
          </CardDescription>

          <div className="flex justify-center items-center mb-4">
            <div className="flex justify-center items-center w-[320px] mt-2 shadow-xl ">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 cursor-pointer ${
                    selectedStrength === i + 1
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-100"
                  } ${i === 0 ? "rounded-l-md" : ""} ${
                    i === 7 ? "rounded-r-md" : ""
                  }`}
                  onClick={() => setSelectedStrength(i + 1)}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <CardDescription className="flex justify-center mt-4 text-gray-600 font-medium text-md">
            Side
          </CardDescription>

          <div className="flex justify-center items-center mt-1 mb-2">
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
              onClick={handleStartGame}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Start Game
            </button>
            {/* <button
                            onClick={selectRandomOptions}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg ml-4"
                        >
                            Randomize
                        </button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
