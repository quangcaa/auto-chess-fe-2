import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import { Conversation } from "../components/inbox/Conversation";
import { calculateTimeDifferences } from "../utils/timeUtils";

export const Inbox = () => {
  const [inboxList, setInboxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInbox, setSelectedInbox] = useState(null); // Chỉ số của chat được chọn

  useEffect(() => {
    const fetchInboxList = async () => {
      try {
        setLoading(true);
        const response = await api.get("http://localhost:3333/inbox");
        const data = await response.data;
        setInboxList(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInboxList();
  }, []);

  const [timeStrings, setTimeStrings] = useState([]);
  useEffect(() => {
    const formattedTimes = calculateTimeDifferences(inboxList, "last_message_time");
    setTimeStrings(formattedTimes);
  }, [inboxList]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading inboxes.</div>;

  const handleInboxSelect = (index) => {
    setSelectedInbox(index); // Cập nhật chỉ số của chat được chọn
  };

  return (
    <div className="w-full h-[calc(100vh-56px)] flex justify-center">
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-1/3 items-center h-full border-gray-100 bg-blue-400 border-gray-400">
          {/* Search bar div */}
          <div className="flex flex-row justify-center items-center w-full h-1/10 bg-white border-b-2 border-gray-100">
            <input
              type="text"
              placeholder="Search"
              className="w-3/4 h-12 px-4 py-2 mx-10 text-gray-700 placeholder-gray-500 bg-gray-100 rounded-3xl border-none shadow-md focus:outline-none transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Conservation List div */}
          <div className="w-full h-full overflow-auto bg-white">
            {inboxList.map((item, index) => {
              const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user_name)}&size=128&background=4CAF50&color=ffffff`;

              return (
                <div key={item.user_id} onClick={() => handleInboxSelect(index)} className={`w-full`}>
                  {/* Conservation UserList */}
                  <div
                    className={`flex h-[80px] flex-row items-center w-full px-5 py-3 rounded-xl transition-transform transform ${
                      selectedInbox === index ? "bg-blue-400 text-white" : "text-gray-800"
                    } ${selectedInbox !== index ? "hover:bg-gray-200" : ""}`}
                  >
                    <img src={avatarUrl} className="h-14 w-14 rounded-full" alt="User Avatar" />
                    <div className="flex flex-col flex-1 ml-4 gap-1">
                      <div className="flex flex-row items-center justify-between">
                        <p className={`text-lg font-semibold ${selectedInbox === index ? "text-white" : "text-gray-800"}`}>
                          {item.user_name}
                        </p>
                        <p className={`text-sm ${selectedInbox === index ? "text-white" : "text-gray-500"}`}>
                          {timeStrings[index]}
                        </p>
                      </div>
                      <p className={`text-sm w-full truncate ${selectedInbox === index ? "text-white" : "text-gray-600"}`}>
                        {item.last_message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedInbox !== null ? (
          <Conversation username={inboxList[selectedInbox].user_name} userId={inboxList[selectedInbox].user_id} />
        ) : (
          <div className="w-full flex flex-col border-gray-100 border-r-2 bg-red-300"></div>
        )}
      </div>
    </div>
  );
};
