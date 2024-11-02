import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import { Conversation } from "../components/inbox/Conversation";
import { calculateTimeDifferences } from "../utils/timeUtils";

export const Inbox = () => {
  const [inboxList, setInboxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInboxList = async () => {
      try {
        setLoading(true);
        const response = await api.get("http://localhost:3333/inbox");
        const data = await response.data;
        console.log(data.data);
        setInboxList(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInboxList();
  }, []);
  const [timeStrings, setTimeStrings] = useState([])
  useEffect(() => {
    const formattedTimes = calculateTimeDifferences(inboxList, 'last_message_time');
    setTimeStrings(formattedTimes);
  }, [inboxList])

  const [selectedInbox, setSelectedInbox] = useState();
  const [selectedUsername, setSelectedUsername] = useState(undefined);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading inboxes.</div>;

  const handleInboxSelect = (item) => {
    setSelectedInbox(item.user_id);
    setSelectedUsername(item.user_name);
    console.log(item);
  };

  return (
    <div className="flex flex-row justify-center w-full h-[calc(100vh-56px)] py-2">
      <div className="flex flex-col w-[400px] items-center h-full border-gray-100 border-r-2">
        <div className="flex flex-row justify-center items-center gap-4 w-full bg-[#edebe8] border-b-2 border-gray-100">
          <input
            type="text"
            placeholder="Search"
            className="w-3/4 h-[40px] px-[16px] py-[8px] border-none rounded-3xl my-[8px] mx-[28px]"
          />
        </div>
        <div className="w-full h-full overflow-auto bg-[#f7f6f5]">
          {inboxList.map((item, index) => (
            <div
              key={item.user_id}
              onClick={() => handleInboxSelect(item)}
              className={`w-full ${
                selectedInbox !== item.user_id
                  ? "hover:bg-[#d5f0b6] bg-[#f7f6f5]"
                  : "bg-[#d0e0bd]"
              }`}
            >
              <div className="flex h-[65px] flex-row items-center w-full px-[21px] py-[12px] gap-4">
                <img src="/after.png" className="h-7 w-7" alt="User" />
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-lg">{item.user_name}</p>
                    <p className="text-[#4d4d4d]">{timeStrings[index]}</p>
                  </div>
                  <p className="text-[#787878]">{item.last_message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedInbox && selectedUsername ? (
        <Conversation username={selectedUsername} userId={selectedInbox} />
      ) : (
        <div className="w-[900px] flex flex-col border-gray-100 border-r-2"></div>
      )}
    </div>
  );
};
