import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { formatMessageTime } from "@/utils/timeUtils";
import { Loading } from "@/components/Loading";
import { RiSendPlane2Fill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { RiSwordFill } from "react-icons/ri";
import { useAuth } from "@/contexts/AuthContext";

export const Conversation = ({ userId, username, onUpdateLastMessage }) => {
  const [loadingSend, setLoadingSend] = useState(false);
  const [successSend, setSuccessSend] = useState(false);

  const { socket } = useAuth();

  useEffect(() => {
    const handleNewMessage = (messageData) => {
      console.log("Received new message:", messageData);
      if (messageData.senderId === userId) {
        setInbox((prevInbox) => [
          ...prevInbox,
          formatMessageTime({
            sender_id: messageData.senderId,
            receiver_id: messageData.receiverId,
            message: messageData.message,
            time: messageData.time,
          }),
        ]);
      }
    };

    socket.on("receive_inbox_message", handleNewMessage);

    return () => {
      socket.off("receive_inbox_message", handleNewMessage);
    };
  }, [socket, userId]);

  const sendMessage = async (userId, message) => {
    setLoadingSend(true);
    setSuccessSend(false);

    try {
      const res = await api.post(`/inbox/send-message/${userId}`, {
        message,
      });
      const data = await res.data;

      setSuccessSend(true);
      return data;
    } catch (error) {
      toast.error(error.res.data.message || "Something went wrong");
    } finally {
      setLoadingSend(false);
    }
  };

  const [loadingInbox, setLoadingInbox] = useState(true);

  const fetchInbox = useCallback(async (userId) => {
    setLoadingInbox(true);
    try {
      const { data } = await api.get(`/inbox/${userId}`);
      return data.data;
    } catch (error) {
      toast.error(error.res.data.message || "Something went wrong");
    } finally {
      setLoadingInbox(false);
    }
  }, []);

  const [inbox, setInbox] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadInbox = async () => {
      try {
        const data = await fetchInbox(userId);
        setInbox(data.map(formatMessageTime));
      } catch (error) {
        toast.error(error.res.data.message || "Something went wrong");
      }
    };

    loadInbox();
    return () => {
      setInbox([]);
    };
  }, [userId, fetchInbox]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [inbox]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    socket.emit("send_inbox_message", {
      senderId: Number(localStorage.getItem("user_id")),
      senderName: localStorage.getItem("username"),
      receiverId: userId,
      message: newMessage,
    });

    const messageData = await sendMessage(userId, newMessage);
    console.log(messageData);
    if (messageData) {
      onUpdateLastMessage(userId, username, newMessage);
      setInbox((prevInbox) => [
        ...prevInbox,
        formatMessageTime({
          sender_id: Number(localStorage.getItem("user_id")),
          message: newMessage,
          time: Date.now(),
        }),
      ]);
      setNewMessage("");
    }
  };

  const handleDeleteInbox = async (e) => {
    e.preventDefault();
    try {
      const res = await api.delete(`/inbox/delete-inbox/${userId}`);

      if (res.status === 200) {
        window.location.reload();
        toast.success("Deleted inbox successfully ;(");
      }
    } catch (error) {
      toast.error(error.res.data.message || "Something went wrong");
    }
  };

  return (
    <div className="w-2/3 flex flex-col border-gray-100 justify-center items-center rounded-r-lg">
      {/* HEADER */}
      <div className="sticky top-0 flex flex-row px-5 justify-between items-center w-full bg-[#EDEBE8] py-[14px] border-b border-gray-300 z-10 rounded-tr-lg">
        <div className="flex flex-row gap-3 items-center">
          <div className="w-6 h-6 border-t-4 border-b-4 border-l-4 border-r-4 rounded-full border-[#4d4d4d] opacity-50"></div>
          <p className="text-xl">{username}</p>
        </div>
        <div className="flex flex-row gap-1">
          <div className="flex justify-center items-center hover:cursor-pointer hover:bg-white hover:rounded-md h-9 w-9 hover:p-2 hover:shadow-md group">
            <RiSwordFill className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
          </div>
          <div className="flex justify-center items-center hover:cursor-pointer hover:bg-white hover:rounded-md h-9 w-9 hover:p-2 hover:shadow-md group">
            <FaTrash
              className="h-4 w-4 text-gray-600 group-hover:text-red-600"
              onClick={handleDeleteInbox}
            />
          </div>
          <div className="flex justify-center items-center hover:cursor-pointer hover:bg-white hover:rounded-md h-9 w-9 hover:p-2 hover:shadow-md group">
            <IoIosWarning className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
          </div>
        </div>
      </div>

      {/* MESSAGE */}
      <div className="flex w-full flex-1 overflow-y-auto overflow-x-hidden justify-center items-start py-3 bg-white">
        <div className="flex flex-col w-[95%] px-10 gap-1 overflow-auto">
          {loadingInbox ? (
            <Loading />
          ) : (
            inbox.map((item, index) => {
              return (
                <div
                  key={item.time}
                  className={`flex flex-col gap-2 mb-1 justify-start ${
                    item.sender_id === userId ? "items-start" : "items-end"
                  }`}
                >
                  {(index === 0 ||
                    item.time.date !== inbox[index - 1].time.date) && (
                    <p className="self-center text-xs text-gray-700 px-3 py-1.5 rounded-md shadow-md border-b border-gray-300 bg-time-inbox">
                      {item.time.date}
                    </p>
                  )}

                  {/* MESSAGE */}
                  <div
                    className={`w-fit max-w-[80%] py-[7px] px-[14px] rounded-md shadow-md border-b border-gray-300 text-sm ${
                      item.sender_id === userId
                        ? "bg-partner-inbox"
                        : "bg-my-inbox text-left"
                    }`}
                  >
                    <p className="break-words flex items-center">
                      {item.message}
                      <span className="text-gray-600 ml-5 text-xs">
                        {item.time.time}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* SEND */}
      <form
        onSubmit={handleSendMessage}
        className="flex flex-row gap-3 items-center justify-between w-full h-[56px] px-4 py-2 bg-[#edebe8] border-t border-gray-300 mt-auto rounded-br-lg"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow h-[40px] px-4 py-2 text-sm bg-white rounded-3xl border border-gray-300 hover:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 placeholder-gray-500"
          placeholder="Type a message..."
          disabled={loadingSend}
        />

        <button
          type="submit"
          disabled={loadingSend || !newMessage.trim()}
          className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-full hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <RiSendPlane2Fill className="size-6" />
        </button>
      </form>
    </div>
  );
};
