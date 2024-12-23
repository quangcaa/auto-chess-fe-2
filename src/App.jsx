import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/guards/ProtectedRoute";
import PublicRoute from "@/guards/PublicRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Auth } from "@/screens/Auth";
import { Setting } from "@/screens/Setting";
import { Homepage } from "@/screens/Homepage";
import { Puzzle } from "@/screens/Puzzle";
import { Game } from "@/screens/Game";
import { Inbox } from "@/screens/Inbox";
import { Forum } from "@/screens/Forum";
import { Profile } from "@/screens/Profile";
import { Admin } from "@/screens/Admin";
import { Report } from "@/screens/Report";
import { PlayVsComputer } from "@/screens/Computer";
import { SpectateGame } from "@/screens/SpectateGame";

function App() {
  return (
    <div className="h-screen bg-main-color flex flex-col">
      <Navbar />

      <div className="flex-grow overflow-auto">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/*" element={<Auth />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/game/:game_id" element={<Game />} />
            <Route path="/computer" element={<PlayVsComputer />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/inbox/:username?" element={<Inbox />} />
            <Route path="/@/:username" element={<Profile />} />
            <Route path="/forum/*" element={<Forum />} />
            <Route path="/report" element={<Report />} />
            <Route path="/spectate/:game_id" element={<SpectateGame />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
