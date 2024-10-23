import { useEffect, useState } from "react";
import { Chess } from "chess.js";

import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import CountdownTimer from "../components/CountdownTimer";
import { useSocket } from "../hooks/useSocket";

import { GAME_OVER, INIT_GAME, MOVE } from "../constants";

export const Game = () => {
    
    const [whiteTimerKey, setWhiteTimerKey] = useState(0); // whitekey
    const [blackTimerKey, setBlackTimerKey] = useState(0);//blackkey
    const [isWhiteTimerRunning, setIsWhiteTimerRunning] = useState(false);//true = chạy timer
    const [isBlackTimerRunning, setIsBlackTimerRunning] = useState(false); 

    const socket = useSocket()
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board())

    useEffect(() => {
        if (!socket) {
            return
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)

            if (message.type === INIT_GAME) {
                console.log("Game initialized")
            } else if (message.type === MOVE) {
                const move = message.payload
                chess.move(move)
                setBoard(chess.board())
                console.log("Move made")
            } else if (message.type === GAME_OVER) {
                console.log("Game over")
            }
        }
    }, [socket])

   

    return (
        <div className=" w-full h-full bg-gray-200 flex items-center justify-center" style={{ height: 'calc(100% - 4rem)' }} >
           {/* khối bên trái */}
        <div className="w-1/4 h-full flex flex-col items-center justify-center space-y-4 p-4 rounded-md">
    <div className="w-full h-1/4 flex flex-col rounded-3xl items-center justify-center border bg-white border-gray-300  font-bold text-lg shadow-md">
     {/*Hiển thị loại game và người chơi */}
      <div className= "w-full h-1/2 flex items-center justify-center text-gray-600">
      <img src="./rabbiticon.png" alt="rabit" className="h-auto w-auto mix-blend-darken"></img>10+5 Rapid
      </div>
      <div className= "w-full h-1/4 flex items-center justify-center text-gray-600">username1</div>
      <div className= "w-full h-1/4 flex items-center justify-center text-gray-600">username2</div>
    </div>
    <div className="w-full h-3/4  flex flex-col justify-end  shadow-md p-4 bg-white rounded-3xl">
  {/* Chat */}
  <div className="flex-1 overflow-y-auto space-y-2">
   
    <div className="bg-white border-b-2 border-gray-200 p-2 rounded-md shadow-sm">
      <strong>User 1:</strong> Hello! How's it going?
    </div>
    <div className="bg-white p-2 rounded-md border-b-2 border-gray-200 shadow-sm">
      <strong>User 2:</strong> I'm doing well, thanks! And you?
    </div>
   
   
  </div>

  {/* Thanh input */}
  <div className="flex items-center space-x-2 mt-2">
    <input
      type="text"
      placeholder="Type a message..."
      className="flex-grow border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
      Send
    </button>
  </div>
</div>
  </div>
   {/* Chess */}
<div className=" h-full  flex justify-center items-center space-y-4 p-4 ">
  <div className="w-[580px] h-[580px] border border-radius-md">
    <ChessBoard socket={socket} />
  </div>
</div>
 {/* phần bên phải */}
        <div className="w-1/4 h-full  flex flex-col items-center justify-center ">
    <div className="w-full h-1/4 ">
    <div className="h-1/2 w-1/2"></div>
      <div className = "h-1/2 w-1/2 flex items-center justify-center bg-white rounded-t-2xl">
        <CountdownTimer 
            key={whiteTimerKey}
            initialMinutes={10}
            initialSeconds={0}
            isRunning={isWhiteTimerRunning}   
          />
          </div>
    </div>
    <div className="w-full h-1/2 bg-white flex flex-col items-center justify-center rounded-s-2xl">
      <div className="w-full h-1/4 bg-white flex flex-col items-center justify-center">
      <div className= "w-full h-1/2 bg-white flex items-center pl-5 ">Username1</div>
      <div className= "w-full h-1/2 bg-gray-300 flex items-center justify-evenly flex-row ">
      <img src="leftarrow.png"className= "h-3/4" ></img>
      <img src="previous.png"className= "h-3/4"  ></img>
      <img src="after.png" className= "h-3/4" ></img>
      <img src="rightarrow.png" className= "h-3/4" ></img>
      </div>
      </div>
         {/* in ra nước đi */}
    <div className="w-full h-2/4 bg-white flex items-center justify-center">box2</div>

      <div className="w-full h-1/4 bg-white flex flex-col items-center justify-center">
      <div className= "w-full h-1/2  flex items-center justify-evenly flex-row mix-blend-darken border border-gray-200 ">
      <img src="draw.png"className= "h-3/4 "  ></img>
      <img src="lose.png"className= "h-3/4 "  ></img>
      </div>
      <div className= "w-full h-1/2 bg-white flex items-center pl-5 ">username2</div>
      </div>
    </div>
    <div className="w-full h-1/4 flex rounder-md">
    <div className = "h-1/2 w-1/2 flex items-center justify-center bg-white rounded-b-2xl">
        <CountdownTimer 
            key={whiteTimerKey}
            initialMinutes={10}
            initialSeconds={0}
            isRunning={isWhiteTimerRunning}   
          />
          </div>
    </div>
  </div>
      </div>
      
    )
};
