import { Route, Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import { Auth } from "./screens/Auth";
import Navbar from "./components/layout/Navbar";
import { Setting } from "./screens/Setting";
import { Homepage } from "./screens/Homepage";
import { Puzzle } from "./screens/Puzzle";
import Game from "./screens/Game";
import { Chat } from "./screens/Chat";
import { Forum } from "./screens/Forum";
import { Profile } from "./screens/Profile";

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

            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/inbox" element={<Chat />} />
            <Route path="/@" element={<Profile />} />

            <Route path="/forum/*" element={<Forum />}>
              {/* <Route path="category" element={<TopicList />} />
              <Route path="category/create-topic" element={<CreateTopic />} /> */}
            </Route>
          </Route>
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
