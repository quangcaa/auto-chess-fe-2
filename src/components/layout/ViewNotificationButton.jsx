import api from "@/utils/axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import {
  IoChatbubbleOutline,
  IoCheckmarkSharp,
  IoCloseSharp,
  IoPersonAddOutline,
} from "react-icons/io5";

export const ViewNotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([])
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notification");
        const data = await response.data;
        setNotificationList(data.data)
        console.log(data)
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkRead = async (notificationId) => {
    try {
      const res = await api.patch(`/notification/mark-read/${notificationId}`)
      console.log(res.data)
      setNotificationList(prev => prev.map(item => {
        if (item.notification_id === notificationId) {
          return { ...item, is_read: true }
        }
        return item
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const res = await api.patch("/notification/mark-all-read")
      console.log(res.data)
      setNotificationList(prev => prev.map(item => {
        return { ...item, is_read: true }
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteAllNotification = async () => {
    try {
      const res = await api.delete('/notification')
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className={
        "relative inline-block text-left p-5 cursor-pointer z-20 " +
        (isOpen ? "bg-white" : "bg-transparent")
      }
    >
      <GoBellFill
        onClick={toggleDropdown}
        className="size-6 hover:text-emerald-600 "
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-[-40px] top-16 z-10 w-64 rounded-md shadow-lg bg-white ring-opacity-5"
        >
          {/* List */}
          <div className="flex flex-row pt-1 pb-1 pl-2 pr-2 items-center justify-between">
            <button onClick={handleMarkAllRead} className="self-center text-blue-500 font-semibold">Mark all read</button>
            <div className="flex justify-center items-center hover:cursor-pointer hover:bg-white hover:rounded-md h-9 w-9 hover:p-2 hover:shadow-md group">
              <FaTrash
                className="h-4 w-4 text-gray-600 group-hover:text-red-600"
                onClick={handleDeleteAllNotification}
              />
            </div>
          </div>
          <hr />
          <div className="flex flex-row p-2 items-center gap-3 h-[60px] hover:bg-gray-100 overflow-hidden">
            <IoChatbubbleOutline size={30} />
            <div className="flex flex-col justify-center gap-[2px] flex-1 overflow-hidden">
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-bold">abcde</p>
                <p className="text-gray-400 text-sm">3 hours ago</p>
              </div>
              <p className="truncate text-sm font-semibold">
                Helloppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp
              </p>
            </div>
          </div>
          <hr />
          <div className="flex flex-col justify-between h-[60px] hover:bg-gray-100 hover:rounded-md hover:h-[88px] overflow-hidden ">
            <div className="flex flex-row p-2 items-center gap-3">
              <IoPersonAddOutline size={30} />
              <div className="flex flex-col justify-center gap-[2px] flex-1 overflow-hidden">
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm font-bold">abcde</p>
                  <p className="text-gray-400 text-sm">3 hours ago</p>
                </div>
                <p className="truncate text-sm font-semibold">
                  Want to be friends with you
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <IoCheckmarkSharp
                size={30}
                className=" text-green-500 rounded-bl-md flex-1 hover:text-white hover:bg-green-500"
              />
              <IoCloseSharp
                size={30}
                className=" text-red-500 flex-1 hover:text-white hover:bg-red-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
  // return (
  //   <div className="flex items-center justify-center h-full cursor-pointer hover:text-emerald-600">
  //     <GoBellFill className="size-6 mx-2" />
  //   </div>
  // );
};
