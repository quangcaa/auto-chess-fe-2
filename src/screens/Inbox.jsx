import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import { Conversation } from "../components/inbox/Conversation";
import { calculateTimeDifferences } from "../utils/timeUtils";

export const Inbox = () => {
  const [inboxList, setInboxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchConversation, setSearchConversation] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);
  const [selectedInbox, setSelectedInbox] = useState(null); // Chỉ số của chat được chọn

  useEffect(() => {
    const fetchInboxList = async () => {
      try {
        setLoading(true);
        const response = await api.get("/inbox");
        const data = await response.data;
        console.log('inbox',data);
        setInboxList(
          data.data.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time))
        );
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
    const formattedTimes = calculateTimeDifferences(
      inboxList,
      "last_message_time"
    );
    setTimeStrings(formattedTimes);
  }, [inboxList]);

  useEffect(() => {
    setSearchConversation(inboxList.filter((item) => item.user_name.startsWith(query)))
  }, [query, inboxList])

  useEffect(() => {
    const fetchSearch = async () => {
      setLoadingSearch(true);
      setErrorSearch(null);
      try {
        if (query) {
          const response = await api.get(`/search/${query}`);
          const data = await response.data;
          console.log(data.users);
          setSearchResults(data.users.filter((item) => !searchConversation.map(inbox => inbox.user_name).includes(item.username)));
        } else {
          setSearchResults([])
        }
      } catch (err) {
        setErrorSearch(err.message);
      } finally {
        setLoadingSearch(false);
      }
    }
    fetchSearch();
  }, [query, searchConversation]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading inboxes.</div>;

  const renderInboxList = (inboxs) => {
    return (
      <>
        {inboxs.map((item, index) => {
          return (
            <div
              key={item.user_id}
              onClick={() => handleInboxSelect(item)}
              className={`w-full`}
            >
              {/* Conservation UserList */}
              <div
                className={`flex h-[80px] gap-3 flex-row items-center w-full px-5 py-3 overflow-hidden transition-transform transform ${
                  selectedInbox !== null && selectedInbox.user_id === item.user_id
                    && "bg-[#D0E0BD]"
                } ${(selectedInbox === null || selectedInbox.user_id !== item.user_id) ? "hover:bg-[#e9f0e0]" : ""}`}
              >
                {/* <img
                  
                  className="h-14 w-14 rounded-full"
                  alt="User Avatar"
                /> */}
                <div className="w-6 h-6 border-t-4 border-b-4 border-l-4 border-r-4 rounded-full border-[#4d4d4d] opacity-50"></div>
                <div className="flex flex-col flex-1 overflow-hidden gap-1">
                  <div className="flex flex-row items-center justify-between">
                    <p
                      className={`text-lg font-semibold`}
                    >
                      {item.user_name}
                    </p>
                    <p
                      className={`text-sm`}
                    >
                      {timeStrings[index]}
                    </p>
                  </div>
                  <p
                    className={`text-sm w-full truncate`}
                  >
                    {item.last_message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const renderSearchResults = () => {
    if (loadingSearch) return <div className="text-center mt-3 font-bold">Loading...</div>;
    if (errorSearch) return <div className="text-center mt-3 font-bold">Error searching.</div>;
    if (searchResults.length === 0 && searchConversation.length === 0) return <div className="text-center mt-3 font-bold">No results found.</div>;

    return (
      <>
        {searchConversation.length !== 0 && 
          <>
            <p className="text-[#d59020] m-5 mb-1 font-semibold">CONVERSATIONS</p>
            {renderInboxList(searchConversation)}
          </>
        }
        {searchResults.length !== 0 &&
        <>
          <p className="text-[#d59020] m-5 mb-1 font-semibold">PLAYERS</p>
          {
            searchResults.map((item) => {
              const username = item.username;
              return (
                <div
                  key={item.user_id + item.username}
                  onClick={() => handleInboxSelect({
                    user_id: item.user_id,
                    user_name: item.username
                  })}
                  className={`w-full`}
                >
                  {/* Conservation UserList */}
                  <div
                    className={`flex h-[50px] gap-4 flex-row items-center w-full px-5 py-3 rounded-xl transition-transform transform text-gray-800 hover:bg-[#e9f0e0]`}
                  >
                    {/* <img
                      className="h-14 w-14 rounded-full"
                      alt="User Avatar"
                    /> */}
                    { item.online !== null ?
                     <div className="w-6 h-6 rounded-full bg-[#629924] opacity-90"></div> :
                     <div className="w-6 h-6 border-t-4 border-b-4 border-l-4 border-r-4 rounded-full border-[#4d4d4d] opacity-50"></div>}
                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: username.replace(new RegExp(query, 'g'), `<b>${query}</b>`) }} />
                  </div>
                </div>
              );
            })
          }
        </>}
      </>
    );
  };

  const handleInboxSelect = (item) => {
    setSelectedInbox(item);
    console.log(item);
    setIsSearching(false)
  };

  const updateLastMessage = (userId, username, message) => {
    setInboxList((prevInboxList) => {
      const userExists = prevInboxList.some((inbox) => inbox.user_id === userId);
  
      let updatedInboxList;
  
      if (userExists) {
        updatedInboxList = prevInboxList.map((inbox) => {
          if (inbox.user_id === userId) {
            return { 
              ...inbox, 
              last_message: message, 
              last_message_time: new Date().toISOString()
            };
          }
          return inbox;
        });
      } else {
        const newInbox = {
          user_id: userId,
          user_name: username,
          last_message: message,
          last_message_time: new Date().toISOString(),
        };
        updatedInboxList = [newInbox, ...prevInboxList];
      }
  
      return updatedInboxList.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time)); // So sánh thời gian
    });
  
    setIsFocus(false);
  };
  

  return (
    <div className="w-full h-[calc(100vh-60px)] py-2 flex justify-center items-center">
      <div className="flex flex-row w-[75%] h-full shadow-gray-400 shadow-md border-[1px] rounded-sm border-gray-400">
        <div className="flex flex-col w-1/3 items-center h-full border-r-[1px] border-gray-400">
          {/* Search bar div */}
          <div className="bg-[#EDEBE8] w-full flex flex-col py-1 justify-center items-center rounded-tl-xl border-b-[1px] border-gray-400 ">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => isSearching && setIsFocus(false)}
              placeholder="Search"
              className="w-[90%] h-12 px-4 py-2 my-1 text-gray-700 placeholder-gray-500 bg-gray-100 rounded-3xl border-none shadow-md focus:outline-none transition-all duration-300 ease-in-out"
            />
          </div>
          {/* Conservation List div */}
          <div className="w-full h-full overflow-auto  rounded-bl-xl ">
            {isFocus && query.length > 0
              ? renderSearchResults()
              : renderInboxList(inboxList)}
          </div>
        </div>

        {selectedInbox !== null ? (
          <Conversation
            onUpdateLastMessage={updateLastMessage}
            username={selectedInbox.user_name}
            userId={selectedInbox.user_id}
          />
        ) : (
          <div className="w-2/3 flex flex-col border-gray-100 border-r-2 bg-white rounded-r-xl"></div>
        )}
      </div>
    </div>
  );
};
