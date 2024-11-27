import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import { Navbar } from "./components/layout/Navbar";
import { Auth } from "./screens/Auth";
import { Setting } from "./screens/Setting";
import { Homepage } from "./screens/Homepage";
import { Puzzle } from "./screens/Puzzle";
import { Game } from "./screens/Game";
import { Inbox } from "./screens/Inbox";
import { Forum } from "./screens/Forum";
import { Profile } from "./screens/Profile";
import { PlayVsComputer } from "./screens/PlayVsComputer";
import { PlayVsComputerCard } from "./components/homepage/PlayVsComputerCard";

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
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/@/:username" element={<Profile />} />
            <Route path="/forum/*" element={<Forum />} />
            <Route path="/playVsComputer" element={<PlayVsComputer />} />
            <Route path="/test2" element={<PlayVsComputerCard />} />
          </Route>
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
