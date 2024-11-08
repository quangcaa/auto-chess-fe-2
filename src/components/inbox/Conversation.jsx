import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../utils/axios";

export const Conversation = ({ userId, username }) => {
  const [loadingSend, setLoadingSend] = useState(false);
  const [errorSend, setErrorSend] = useState(null);
  const [successSend, setSuccessSend] = useState(false);

  const avatarUrl = `https://ui-avatars.com/api/?name=${username}&size=128&background=4CAF50&color=ffffff`;

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
      setErrorInbox(err instanceof Error ? err.message : "An unexpected error occurred");
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

  const handleDeleteInbox = async (e) => {
    e.preventDefault();
    try {
      const response = await api.delete(`/inbox/delete-inbox/${userId}`)
      if (response.status === 200) {
        window.location.reload();
        console.log("Inbox deleted successfully");
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full flex flex-col border-gray-100 border-r-2 justify-center items-center">
      {/* Header */}
      <div className="sticky top-0 flex flex-row px-5 justify-between items-center w-full bg-[#ffffff] py-3 border border-gray-200 z-10">
        <div className="flex flex-row gap-3 items-center">
          <img src={avatarUrl} className="h-10 w-10 rounded-full" />
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
          <img src="/deleteInbox.png" onClick={handleDeleteInbox} className="h-7 w-7" />
        </div>
      </div>

      {/* Message List */}
      <div className="flex w-full overflow-auto justify-center items-center py-3">
        {/* This div takes 3/5 of the width and is centered */}
        <div className="flex flex-col w-3/5 px-10 gap-1 overflow-auto">
          {loadingInbox ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : (
            inbox.map((item, index) => {
              const isLastFromSender =
                item.sender_id === userId &&
                (index === inbox.length - 1 || inbox[index + 1].sender_id !== item.sender_id);

              return (
                <div
                  key={item.time}
                  className={`flex items-start gap-3 ${item.sender_id === userId ? "justify-start" : "justify-end"}`}
                >
                  {/* Avatar for the last message from the sender (userId) */}
                  {item.sender_id === userId && isLastFromSender ? (
                    <img
                      src={avatarUrl}
                      alt={`${item.user_name}'s avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    // Placeholder for alignment when no avatar is shown
                    <div className="w-10 h-10"></div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`w-fit max-w-[80%] p-3 rounded-xl shadow-md ${
                      item.sender_id === userId ? "bg-blue-100 text-right" : "bg-green-100 text-left"
                    }`}
                  >
                    <p className="break-words">{item.message}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Send */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center justify-between w-3/5 h-[56px] px-4 py-2 bg-[#edebe8] border-t-2 border-gray-100 mt-auto"
      >
        {/* Message input field */}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow h-[40px] px-4 py-2 text-sm bg-white rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          placeholder="Type a message..."
          disabled={loadingSend}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={loadingSend || !newMessage.trim()}
          className="ml-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>

        {/* Error messages */}
        {(errorSend || errorInbox) && (
          <p className="text-red-500 text-sm ml-2">{errorSend || errorInbox}</p>
        )}
      </form>
    </div>
  );
};
