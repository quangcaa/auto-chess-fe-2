import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../utils/axios";

export const Conversation = ({ userId, username }) => {
  const [loadingSend, setLoadingSend] = useState(false);
  const [errorSend, setErrorSend] = useState(null);
  const [successSend, setSuccessSend] = useState(false);

  const sendMessage = async (userId, message) => {
    setLoadingSend(true);
    setErrorSend(null);
    setSuccessSend(false);

    try {
      const response = await api.post(
        `http://localhost:3333/inbox//send-message/${userId}`,
        {
          message: message,
        }
      );
      const data = await response.data;
      setSuccessSend(true);
      return data;
    } catch (err) {
      setErrorSend(err.message);
    } finally {
      setLoadingSend(false);
    }
  };
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [errorInbox, setErrorInbox] = useState(null);

  const fetchInbox = useCallback(async (userId) => {
    setLoadingInbox(true);
    setErrorInbox(null);
    try {
      const { data } = await api.get(`/inbox/${userId}`);
      return data.data;
    } catch (err) {
      setErrorInbox(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
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
        setInbox(data);
      } catch (error) {
        console.error("Error fetching inbox:", error);
      }
    };

    loadInbox();
    return () => {
      setInbox([]);
    };
  }, [userId, fetchInbox]);

  useEffect(() => {
    const loadInbox = async () => {
      try {
        const data = await fetchInbox(userId);
        setInbox(data);
      } catch (error) {
        console.error("Error fetching inbox:", error);
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

    const messageData = await sendMessage(userId, newMessage);

    if (messageData) {
      setInbox((prevInbox) => [
        ...prevInbox,
        { sender_id: null, message: newMessage, time: Date.now() },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-[900px] flex flex-col border-gray-100 border-r-2">
      {/* Header */}
      <div className="flex flex-row px-5 justify-between py-[14px] items-center w-full bg-[#edebe8] border-b-2 border-gray-100">
        <div className="flex flex-row gap-3">
          <img src="/after.png" className="h-7 w-7" />
          <p className="text-lg">{username}</p>
        </div>
        <div className="flex flex-row gap-3">
          <svg
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.04813 13.4061L10.5831 16.9421L9.1703 18.3558L10.5849 19.7711L9.17064 21.1853L6.69614 18.71L3.86734 21.5388L2.45312 20.1246L5.28192 17.2958L2.80668 14.8213L4.22089 13.4071L5.63477 14.8202L7.04813 13.4061ZM2.99907 3L6.54506 3.00335L18.3624 14.8207L19.7772 13.4071L21.1915 14.8213L18.7166 17.2962L21.545 20.1246L20.1308 21.5388L17.3024 18.7104L14.8275 21.1853L13.4133 19.7711L14.8269 18.3562L3.00181 6.53118L2.99907 3ZM17.4563 3.0001L20.9991 3.00335L21.001 6.52648L16.9481 10.5781L13.4121 7.0431L17.4563 3.0001Z"></path>
          </svg>
          <img src="/after.png" className="h-7 w-7" />
          <img src="/after.png" className="h-7 w-7" />
          <img src="/after.png" className="h-7 w-7" />
        </div>
      </div>
      {/* Message List */}
      <div className="bg-white flex-grow flex flex-col w-full px-10 gap-3 py-5 overflow-auto">
        {loadingInbox ? (
          <p>Loading messages...</p>
        ) : (
          inbox.map((item) => (
            <div
              key={item.time}
              className={`w-fit p-2 rounded-xl bg-[#e9f0e0] ${
                item.sender_id === userId ? "" : "self-end"
              }`}
            >
              <p className="max-w-[360px] break-words">{item.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Send */}
      <form
        onSubmit={handleSendMessage}
        className="flex flex-row justify-center items-center gap-4 w-full h-[55px] bg-[#edebe8] border-t-2 border-gray-100"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-3/4 h-[40px] px-[16px] py-[8px] border-none rounded-3xl my-[8px] mx-[28px]"
          disabled={loadingSend}
        />
        <button type="submit" disabled={loadingSend || !newMessage.trim()}>
          Send
        </button>
        {errorSend && <p className="text-red-500">{errorSend}</p>}
        {errorInbox && <p className="text-red-500">{errorInbox}</p>}
      </form>
    </div>
  );
};
