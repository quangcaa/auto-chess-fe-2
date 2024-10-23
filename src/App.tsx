import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Game } from "./screens/Game";
import { Auth } from "./screens/Auth";
import { Profile } from "./screens/Profile";
import { Setting } from "./screens/Setting";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/Navbar";
import { CreateTopic } from "./components/CreateTopic";
import { Forum } from "./screens/Forum";
import { TopicList } from "./components/TopicList";
import Layout from './components/Layout';

function App() {
  return (
    <div className="h-screen bg-main-color">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Auth />} />
            <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/game" element={<Game />} />
                <Route path="/my-profile" element={<Profile />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/forum/category" element={<TopicList />} />
                <Route path="/forum/category/create-topic" element={<CreateTopic />} />
              </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div >
  );
}

export default App;
