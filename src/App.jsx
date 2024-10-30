import { useState, useEffect } from "react";
import { Route, Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { io } from "socket.io-client";
import { MOVE, GAME_OVER, JOIN_GAME } from "./constants/game";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import { Auth } from "./screens/Auth";
import Navbar from "./components/layout/Navbar";
import { Setting } from "./screens/Setting";
import { Homepage } from "./screens/Homepage";
import Game from "./screens/Game";

// backend url
// const socket = io(`http://localhost:5000`);

// function App() {
//   const [game, setGame] = useState(new Chess());
//   const [roomId, setRoomId] = useState("");
//   const [isJoined, setIsJoined] = useState(false);

//   useEffect(() => {
//     socket.on(MOVE, (move) => {
//       game.move(move);
//       setGame(new Chess(game.fen()));
//     });

//     socket.on("room_created", (newRoomId) => {
//       setRoomId(newRoomId);
//       setIsJoined(true);
//     });

//     socket.on("room_joined", (newRoomId) => {
//       setRoomId(newRoomId);
//       setIsJoined(true);
//     });

//     return () => {
//       socket.off("move");
//       socket.off("room_created");
//       socket.off("room_joined");
//     };
//   }, [game]);

//   const createRoom = () => {
//     socket.emit("create_room"); // Yêu cầu tạo phòng mới
//   };

//   const joinRoom = () => {
//     if (roomId) {
//       socket.emit("join_room", roomId); // Tham gia phòng với roomId đã nhập
//     }
//   };

//   const onDrop = (source, target) => {
//     const move = game.move({ from: source, to: target });
//     if (move === null) return false;

//     setGame(new Chess(game.fen()));
//     socket.emit(MOVE, { room_id: roomId, move }); // send move to server
//     return true;
//   };

//   return (
//     <div className="App">
//       {!isJoined ? (
//         <div>
//           <button onClick={createRoom}>Create Room</button>
//           <input
//             type="text"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//             placeholder="Enter Room ID"
//           />
//           <button onClick={joinRoom}>Join Room</button>
//         </div>
//       ) : (
//         <div className="flex justify-center">
//           <div className="grid grid-cols-1 gap4 md:grid-cols-3">
//             <div>
//               <p>Room ID: {roomId}</p>
//             </div>
//             <div>
//               <Chessboard position={game.fen()} onPieceDrop={onDrop} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

function App() {
  return (
    <div className="h-screen bg-main-color flex flex-col">
      <Navbar />

      <div className="flex-grow overflow-auto">
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/*" element={<Auth />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/game" element={<Game />} />

            {/* 
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/inbox" element={<Chat />} />
          <Route path="/@" element={<Profile />} />
          
          <Route path="/forum/*" element={<Forum />}>
            <Route path="category" element={<TopicList />} />
            <Route path="category/create-topic" element={<CreateTopic />} />
          </Route> */}
          </Route>
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
