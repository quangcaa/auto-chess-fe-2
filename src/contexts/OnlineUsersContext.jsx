import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = ({ user_id }) => {
      setOnlineUsers((prev) => new Set(prev).add(user_id));
    };

    const handleUserOffline = ({ user_id }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user_id);
        return newSet;
      });
    };

    // Listen for events
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [socket]);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => useContext(OnlineUsersContext);
