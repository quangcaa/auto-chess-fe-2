import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Game } from "./screens/Game";
import { Auth } from "./screens/Auth";
import { Profile } from "./screens/Profile";
import { Setting } from "./screens/Setting";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import { CreateTopic } from "./components/CreateTopic";
import { Forum } from "./screens/Forum";
import { TopicList } from "./components/TopicList";
import React from "react";

function App() {
  return (
    <div className="h-screen bg-main-color">
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

const AppContent = () => {
  // Sử dụng hook useAuth để lấy trạng thái xác thực
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Chỉ render NavBar khi đã đăng nhập */}
      {isAuthenticated && <NavBar />}
      <Routes>
        {/* Các route không yêu cầu xác thực */}
        <Route path="/*" element={<Auth />} />

        {/* Các route yêu cầu xác thực được bọc trong `PrivateRoute` */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/category" element={<TopicList />} />
          <Route
            path="/forum/category/create-topic"
            element={<CreateTopic />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
