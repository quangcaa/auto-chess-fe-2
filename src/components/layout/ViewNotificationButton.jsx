import { useState, useEffect, useRef } from "react";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

import { FaRegTrashAlt, FaCaretUp } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { GoBellFill } from "react-icons/go";
import { MdPostAdd } from "react-icons/md";
import { SlUserFollowing } from "react-icons/sl";

import { useLocation } from "react-router-dom";

export const ViewNotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await api.get("/notification");
        const data = response.data.data;

        console.log(data);

        setNotificationList(data);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    fetchNotification();
  }, [location]);

  // close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAll = async () => {
    try {
      await api.patch("/notification/mark-all-read");
      setNotificationList((prev) =>
        prev.map((noti) => ({ ...noti, is_read: true }))
      );
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const handleMarkAsRead = async (notification_id) => {
    try {
      await api.patch(`/notification/mark-read/${notification_id}`);
      setNotificationList((prev) =>
        prev.map((noti) =>
          noti.notification_id === notification_id
            ? { ...noti, is_read: true }
            : noti
        )
      );
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await api.delete("/notification");
      setNotificationList([]);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <div
      className="relative h-full flex items-center justify-center"
      ref={dropdownRef}
    >
      <div
        onClick={toggleNotifications}
        className={`cursor-pointer h-[60px] text-lg flex items-center justify-center transition duration-300 ${
          isOpen ? "bg-white hover:text-emerald-600" : "hover:text-emerald-600"
        }`}
      >
        <GoBellFill className="mx-2 size-6" />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 w-[350px] bg-white shadow-lg border border-gray-300 rounded-l-lg rounded-br-lg z-10">
          {/* HEADER */}
          <div className="flex flex-row justify-between items-center p-2 border-b border-gray-300">
            <button className="px-1 group" onClick={() => handleMarkAll()}>
              <IoMdCheckmark
                className="size-6 hover:text-green-600"
                title="Mark all read"
              />
            </button>

            <FaCaretUp className="size-6 opacity-50" />

            <button className="px-1 group" onClick={() => handleDeleteAll()}>
              <FaRegTrashAlt
                className="size-5 hover:text-red-600"
                title="Delete all"
              />
            </button>
          </div>

          <div className="max-h-60 no-scrollbar overflow-y-auto rounded-b-lg">
            {notificationList.length > 0 ? (
              notificationList.map((notification) => (
                <a
                  key={notification.notification_id}
                  className={`flex flex-grow border-b last:border-none ${
                    notification.is_read ? "bg-gray-100" : "bg-white"
                  }`}
                  onClick={() => handleMarkAsRead(notification.notification_id)}
                >
                  <div className="pl-3 py-2 flex justify-center items-center">
                    {notification.type === "forum" ? (
                      <MdPostAdd className="size-7" />
                    ) : (
                      <SlUserFollowing className="size-6 mr-1" />
                    )}
                  </div>

                  <div className="px-3 py-2 flex w-full">
                    {notification.type === "forum" ? (
                      <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col">
                          <span
                            className="text-gray-600 font-medium text-base truncate max-w-[185px]"
                            title={notification.subject}
                          >
                            {notification.subject}
                          </span>
                          <span
                            className="text-gray-600 text-sm truncate max-w-[185px]"
                            title={notification.content}
                          >
                            {notification.content}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                            }
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col">
                          <span
                            className="text-gray-600 font-medium text-base truncate max-w-[185px]"
                            title={notification.username}
                          >
                            {notification.username}
                          </span>
                          <span
                            className="text-gray-600 text-sm truncate max-w-[185px]"
                            title={notification.content}
                          >
                            {notification.content}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </a>
              ))
            ) : (
              <div className="py-2 text-lg text-gray-500 flex justify-center">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
