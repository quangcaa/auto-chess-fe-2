import React, { useState, useEffect, useRef } from "react";
import { GoBellFill } from "react-icons/go";
import { FaRegTrashAlt, FaFacebookMessenger } from "react-icons/fa";
import { MdTopic } from "react-icons/md";
import { SlUserFollowing } from "react-icons/sl";
import api from "@/utils/axios";
import { useLocation } from "react-router-dom";

export const ViewNotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const getUsername = async (user_id) => {
    try {
      const response = await api.get(`/@/${user_id}/public`);
      console.log(response.data);
      return response.data.user.username;
    } catch (error) {
      setError('Error fetching notification');
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await api.get('/notification');

        const testData = response.data.data;
        console.log((testData));

        setNotificationList(response.data.data);
      } catch (error) {
        setError('Error fetching user notification');
        console.error(error);
      }
    };
  
    fetchNotification();
  }, [location])


  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
    // setIsLoaded((prev) => !prev);
  }

  useEffect(() => {
    if (isOpen && !isLoaded) {
      const fetchUsernameList = async () => {
        if (notificationList.length > 0) {
          const usernamePromises = notificationList.map(async (noti) => {
            const username = await getUsername(noti.source_id);
            return { ...noti, username }; 
          });

          const updatedNoti = await Promise.all(usernamePromises);
          console.log(updatedNoti);
          setNotificationList(updatedNoti); 
        }
      };

      fetchUsernameList();
      setIsLoaded(true);
    }
  }, [isOpen, notificationList, isLoaded]);

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // setIsLoaded(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReadAll = async () => {
    try {
      const response = await api.patch("/notification/mark-all-read");
      if (response.data.success) {
        console.log("Notification marked as read all successfully.");
      }
      setNotificationList((prev) =>
        prev.map((noti) => ({ ...noti, is_read: true }))
      );
    } catch (error) {
      setError("Error to read all notifications")
      console.error(error)
    }
  };

  const handleRead = async (notification_id) => {
    try {
      const response = await api.patch(`/notification/mark-read/${notification_id}`)
      if (response.data.success) {
        console.log("Notification marked as read successfully.");
      }
      setNotificationList((prev) =>
        prev.map((noti) =>
          noti.notification_id === notification_id
            ? { ...noti, is_read: true }
            : noti
        )
      );
    } catch (error) {
      setError("Error to read this notification")
      console.error(error);
    }
  }

  const handleDeleteAll = async () => {
    try {
      const response = await api.delete("/notification");
      if (response.data.success) {
        console.log("Completely delete!");
      }
      setNotificationList([]);
    } catch (error) {
      setError("Error to delete notifications")
      console.error(error);
    }
  }

  return (
    <div className="relative h-full flex items-center justify-center" ref={dropdownRef}>
      {/* Icon chuông */}
      <div
        className={`flex items-center justify-center cursor-pointer transition-colors duration-300 ${isOpen ? "text-emerald-600" : "text-gray-600"
          }`}
        onClick={toggleNotifications}
      >
        <GoBellFill className="text-xl mx-2" />
      </div>

      {/* Dropdown thông báo */}
      {isOpen && (
        <div className="absolute top-full right-0 w-64 bg-white shadow-lg border border-gray-300 rounded-lg p-4 z-10">
          <button  className="absolute right-5 " 
                  onClick={() => handleReadAll()}>
            Read all
          </button>
          <div className="mt-5 mb-3">
            {notificationList.length > 0 ? (
              notificationList.map((notification) => (
                <a
                  key={notification.notification_id}
                  className={`flex py-2 px-2 flex-grow border-b last:border-none text-sm ${notification.is_read ? "bg-gray-100" : "bg-white"
                    }`}
                    onClick={() => handleRead(notification.notification_id)}
                >
                  <div className="flex justify-center items-center mr-5">
                    {notification.type === "message" ? (
                      <FaFacebookMessenger className="size-5" />
                    ) : notification.type === "topic" ? (
                      <MdTopic className="size-6" />
                    ) : (
                      <SlUserFollowing className="size-5" />
                    )}
                  </div>
                  
                  <div >
                    <span className="text-gray-600">{notification.username} </span>
                    <span className="text-gray-600">{notification.content}</span>
                    <div className="text-xs text-gray-500">{notification.create_at}</div>
                  </div>
                </a>
              ))
            ) : (
              <div className="py-2 text-sm text-gray-500">No notifications</div>
            )}
          </div>

          <button className="absolute bottom-3 right-5 "
                onClick={() => handleDeleteAll()}>
            <FaRegTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};
