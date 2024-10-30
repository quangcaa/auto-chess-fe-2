import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { disconnectSocket, initSocket } from "../socket/socket.fe";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      const user_id = localStorage.getItem("user_id");
      const newSocket = initSocket(user_id);
      console.log(`[NEWSOCKET] : ${newSocket}`)
      setSocket(newSocket);
    }
    setLoading(false);
  }, []);

  const login = (accessToken, refreshToken, username, user_id) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("username", username);
    localStorage.setItem("user_id", user_id);
    setIsAuthenticated(true);
    const newSocket = initSocket(user_id);
    setSocket(newSocket);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    disconnectSocket();
    setSocket(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, socket }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  console.log(context);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
