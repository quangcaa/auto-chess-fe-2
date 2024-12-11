import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSocketStore from "../store/socketStore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { connect, disconnect, socket } = useSocketStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user_id = parseInt(localStorage.getItem("user_id"), 10);
    const savedRole = localStorage.getItem("role");

    if (token && user_id && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
      if (!socket) {
        connect(user_id);
      }
    }
    setLoading(false);
  }, [connect, socket]);

  const login = (accessToken, refreshToken, username, user_id, userRole) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("username", username);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("role", userRole); 
    setIsAuthenticated(true);
    setRole(userRole); 
    connect(user_id);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role"); 
    setIsAuthenticated(false);
    setRole(null); 
    disconnect();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, loading, login, logout, socket }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
