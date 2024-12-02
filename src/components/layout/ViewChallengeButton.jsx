import api from "@/utils/axios";
import { useEffect, useRef, useState } from "react";
import { IoIosPaperPlane } from "react-icons/io";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import { RiSwordFill } from "react-icons/ri";
import toast from "react-hot-toast";

export const ViewChallengeButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [challengeList, setChallengeList] = useState([])
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
    const fetchChallenges = async () => {
      try {
        const response = await api.get("/challenge");
        const data = await response.data;
        setChallengeList(data.data)
        console.log(data)
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    fetchChallenges();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };
  
  return (
    <div
      className={
        "relative text-left p-5 cursor-pointer z-20 " +
        (isOpen ? "bg-white" : "bg-transparent")
      }
    >
      <RiSwordFill onClick={toggleDropdown} className="size-6 hover:text-emerald-600 " />
      {isOpen && (
        <div ref={dropdownRef} className="absolute left-0 top-16 w-56 rounded-md rounded-tl-none shadow-lg bg-white ring-opacity-5">
          {/* List */}
          <div className="flex flex-col justify-between h-[60px] hover:bg-blue-200 hover:rounded-md hover:text-emerald-600 hover:h-24 overflow-hidden">
            <div className="flex flex-row items-center justify-between gap-1 p-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">abcde(1500?)</p>
                <p>1+0 Bullet</p>
              </div>
              <IoIosPaperPlane className="size-8" />
            </div>
            <div className="flex flex-row items-center justify-between">
              <IoCheckmarkSharp size={30} className=" text-green-500 rounded-bl-md flex-1 hover:text-white hover:bg-green-500" />
              <IoCloseSharp size={30} className=" text-red-500 flex-1 hover:text-white hover:bg-red-500" />
            </div>
          </div>
          <hr />
          <div className="flex flex-col justify-between h-[60px] hover:bg-blue-200 hover:rounded-md hover:text-emerald-600 hover:h-24 overflow-hidden">
            <div className="flex flex-row items-center justify-between gap-1 p-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">abcde(1500?)</p>
                <p>1+0 Bullet</p>
              </div>
              <IoIosPaperPlane className="size-8" />
            </div>
            <div className="flex flex-row items-center justify-between">
              <IoCheckmarkSharp size={30} className=" text-green-500 rounded-bl-md flex-1 hover:text-white hover:bg-green-500" />
              <IoCloseSharp size={30} className=" text-red-500 flex-1 hover:text-white hover:bg-red-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
  // return (
  //   <div className="flex items-center justify-center h-full cursor-pointer hover:text-emerald-600">
  //     <RiSwordFill className="size-6 ml-2 mr-2" />
  //   </div>

  // );
};
