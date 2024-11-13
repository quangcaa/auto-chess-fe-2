import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../utils/axios";
import { formatMessageTime } from "@/utils/timeUtils";

export const Conversation = ({ userId, username, onUpdateLastMessage }) => {
  const [loadingSend, setLoadingSend] = useState(false);
  const [errorSend, setErrorSend] = useState(null);
  const [successSend, setSuccessSend] = useState(false);

  const sendMessage = async (userId, message) => {
    setLoadingSend(true);
    setErrorSend(null);
    setSuccessSend(false);

    try {
      const response = await api.post(`/inbox/send-message/${userId}`, {
        message,
      });
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
        setInbox(data.map(formatMessageTime));
        console.log(data.map(formatMessageTime));
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
      onUpdateLastMessage(userId, newMessage);
      setInbox((prevInbox) => [
        ...prevInbox,
        formatMessageTime({ sender_id: null, message: newMessage, time: Date.now() }),
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
    <div className="w-2/3 flex flex-col border-gray-100  justify-center items-center rounded-r-xl ">
      {/* Header */}
      <div className="sticky top-0 flex flex-row px-5 justify-between items-center w-full bg-[#EDEBE8] py-[14px] border-b-[1px] border-gray-400 z-10 rounded-tr-xl">
        <div className="flex flex-row gap-3 items-center">
        <div className="w-6 h-6 border-t-4 border-b-4 border-l-4 border-r-4 rounded-full border-[#4d4d4d] opacity-50"></div>
          <p className="text-lg">{username}</p>
        </div>
        <div className="flex flex-row gap-3">
          {/* <svg
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="size-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.04813 13.4061L10.5831 16.9421L9.1703 18.3558L10.5849 19.7711L9.17064 21.1853L6.69614 18.71L3.86734 21.5388L2.45312 20.1246L5.28192 17.2958L2.80668 14.8213L4.22089 13.4071L5.63477 14.8202L7.04813 13.4061ZM2.99907 3L6.54506 3.00335L18.3624 14.8207L19.7772 13.4071L21.1915 14.8213L18.7166 17.2962L21.545 20.1246L20.1308 21.5388L17.3024 18.7104L14.8275 21.1853L13.4133 19.7711L14.8269 18.3562L3.00181 6.53118L2.99907 3ZM17.4563 3.0001L20.9991 3.00335L21.001 6.52648L16.9481 10.5781L13.4121 7.0431L17.4563 3.0001Z"></path>
          </svg> */}
          <div className="flex justify-center items-center hover:cursor-pointer hover:bg-white hover:rounded-md h-9 w-9 hover:p-2 hover:shadow-md">
          <img 
            src="/deleteInbox.png" 
            onClick={handleDeleteInbox} 
            className="h-5 w-5" 
            alt="Delete Inbox" 
          />
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex w-full flex-1 overflow-y-auto overflow-x-hidden justify-center items-start py-3 bg-white">
        {/* This div takes 3/5 of the width and is centered */}
        <div className="flex flex-col w-[95%] px-10 gap-1 overflow-auto">
          {loadingInbox ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : (
            inbox.map((item, index) => {
              return (
                <div
                  key={item.time}
                  className={`flex flex-col gap-2 mb-1 justify-start ${item.sender_id === userId ? "items-start" : "items-end"}`}
                >
                  {(index === 0 || item.time.date !== inbox[index - 1].time.date) && (
                    <p className=" self-center text-sm text-gray-500 p-2 rounded-md bg-[#ddebf8]">{item.time.date}</p>
                  )}
                  {/* Avatar for the last message from the sender (userId)
                  {item.sender_id === userId && isLastFromSender ? (
                  //   <img
                  //     src={avatarUrl}
                  //     alt={`${item.user_name}'s avatar`}
                  //     className="w-10 h-10 rounded-full"
                  //   />
                  // ) : (
                  //   // Placeholder for alignment when no avatar is shown
                  //   <div className="w-10 h-10"></div>
                  )} */}

                  {/* Message Bubble */}
                  <div
                    className={`w-fit max-w-[80%] py-2 px-3 rounded-md text-[#1F1F1F] fonts-sans text-sm ${
                      item.sender_id === userId ? "bg-[#F8EEDD]" : "bg-[#E9F0E0] text-left"
                    }`}
                  >
                    <p className="break-words">{item.message}<span className="float-right text-gray-500 pl-5 pt-[1px] text-xs">{item.time.time}</span></p>
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
        className="flex flex-row gap-3 items-center justify-between w-full h-[56px] px-4 py-2 bg-[#edebe8] border-t-2 border-gray-100 mt-auto"
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
