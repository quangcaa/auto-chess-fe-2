import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { RiSwordFill } from "react-icons/ri";
import { IoIosPaperPlane } from "react-icons/io";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";

export const ViewChallengeButton = () => {
  const [challengeList, setChallengeList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get("/challenge");
        const data = await response.data;
        setChallengeList(data.data);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    fetchChallenges();
  }, [location]);

  const toggleChallenge = () => {
    setIsOpen(!isOpen);
  };

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

  const handleAccept = async (challenge_id) => {
    try {
      const response = await api.post(`/challenge/accept/${challenge_id}`);
      const { game_id } = response.data;
      navigate(`/game/${game_id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept challenge"
      );
    }
  };

  const handleDecline = async (challenge_id) => {
    try {
      await api.post(`/challenge/decline/${challenge_id}`);
      setChallengeList((prev) =>
        prev.filter((challenge) => challenge.challenge_id !== challenge_id)
      );
      toast.success("Challenge declined");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to decline challenge"
      );
    }
  };

  return (
    <div
      className="relative h-full flex items-center justify-center"
      ref={dropdownRef}
    >
      <div
        onClick={toggleChallenge}
        className={`cursor-pointer h-[60px] text-lg flex items-center justify-center transition duration-300 ${
          isOpen ? "bg-white hover:text-emerald-600" : "hover:text-emerald-600"
        }`}
      >
        <RiSwordFill className="mx-2 size-6" />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 w-[300px] bg-white shadow-lg border border-gray-300 rounded-l-lg rounded-br-lg z-50">
          {challengeList.length > 0 ? (
            <ul>
              {challengeList.map((challenge) => (
                <li
                  key={challenge.challenge_id}
                  className="mb-2 p-2 bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>From:</strong> {challenge.sender_id}
                    </p>
                    <p>
                      <strong>Status:</strong> {challenge.status}
                    </p>
                    {/* <p>
                      <strong>Created:</strong>{" "}
                      {new Date(challenge.created_at).toLocaleString()}
                    </p> */}
                  </div>
                  <div className="flex gap-2">
                    <IoCheckmarkSharp
                      className="size-8 cursor-pointer text-green-500 hover:text-white hover:bg-green-500 rounded-full p-1"
                      onClick={() => handleAccept(challenge.challenge_id)}
                    />
                    <IoCloseSharp
                      className="size-8 cursor-pointer text-red-500 hover:text-white hover:bg-red-500 rounded-full p-1"
                      onClick={() => handleDecline(challenge.challenge_id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-2 text-lg text-gray-500 flex justify-center">
              No challenges
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// <div
// className={
//   "relative text-left cursor-pointer z-20 " +
//   (isOpen ? "bg-white" : "bg-transparent")
// }
// >
// <RiSwordFill
//   onClick={toggleChallenge}
//   className="size-6 hover:text-emerald-600 "
// />
// {isOpen && (
//   <div
//     ref={dropdownRef}
//     className="absolute left-0 top-16 w-56 rounded-md rounded-tl-none shadow-lg bg-white ring-opacity-5"
//   >
//     {/* List */}
//     <div className="flex flex-col justify-between h-[60px] hover:bg-blue-200 hover:rounded-md hover:text-emerald-600 hover:h-24 overflow-hidden">
//       <div className="flex flex-row items-center justify-between gap-1 p-2">
//         <div className="flex flex-col gap-1">
//           <p className="text-sm font-bold">abcde(1500?)</p>
//           <p>1+0 Bullet</p>
//         </div>
//         <IoIosPaperPlane className="size-8" />
//       </div>
//       <div className="flex flex-row items-center justify-between">
//         <IoCheckmarkSharp
//           size={30}
//           className=" text-green-500 rounded-bl-md flex-1 hover:text-white hover:bg-green-500"
//         />
//         <IoCloseSharp
//           size={30}
//           className=" text-red-500 flex-1 hover:text-white hover:bg-red-500"
//         />
//       </div>
//     </div>
//     <hr />
//     <div className="flex flex-col justify-between h-[60px] hover:bg-blue-200 hover:rounded-md hover:text-emerald-600 hover:h-24 overflow-hidden">
//       <div className="flex flex-row items-center justify-between gap-1 p-2">
//         <div className="flex flex-col gap-1">
//           <p className="text-sm font-bold">abcde(1500?)</p>
//           <p>1+0 Bullet</p>
//         </div>
//         <IoIosPaperPlane className="size-8" />
//       </div>
//       <div className="flex flex-row items-center justify-between">
//         <IoCheckmarkSharp
//           size={30}
//           className=" text-green-500 rounded-bl-md flex-1 hover:text-white hover:bg-green-500"
//         />
//         <IoCloseSharp
//           size={30}
//           className=" text-red-500 flex-1 hover:text-white hover:bg-red-500"
//         />
//       </div>
//     </div>
//   </div>
// )}
// </div>
