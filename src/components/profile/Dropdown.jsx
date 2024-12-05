import { useState } from "react";
import { TfiMenu } from "react-icons/tfi";
import { IoMdSettings } from "react-icons/io";
import { ImBubble2, ImHeart, ImUser } from "react-icons/im";
import { GiBattleAxe } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";

export const Dropdown = ({ isOwner = true, isFollowing = false, user_id, setFollowType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(isFollowing);

  const { username } = useParams();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleFollow = async () => {
    try {
      if (!isFollow) {
        const response = await api.post(`rel/follow/${username}`);
        setIsFollow(true);
      } else {
        const response = await api.delete(`rel/unfollow/${username}`);
        setIsFollow(false);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const handleChallenge = async () => {
    try {
      const response = await api.post(`/@/${username}/challenge`);
      toast.success(response.data.message || "Challenge sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send challenge");
    }
  };

  return (
    <div className="relative inline-block text-left">
      <span
        onClick={toggleDropdown}
        className={`cursor-pointer rounded-t-lg text-base transition duration-300 px-3 py-2 flex items-center ${
          isOpen ? "bg-white rounded-t-lg drop-shadow-lg" : "bg-transparent"
        }`}
      >
        <TfiMenu className="size-6 text-gray-700" />
      </span>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 rounded-md border-b shadow-[-4px_4px_10px_rgba(0,0,0,0.3)] bg-white rounded-tr-none">
          {isOwner && (
            <>
              <a
                href="/setting"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <IoMdSettings className="size-5 mr-2" />
                Edit Profile
              </a>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full"
                  onClick={() => setFollowType("follower")}>
                <FaUserFriends className="size-5 mr-2" />
                Follower
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full"
                  onClick={() => setFollowType("following")}>
                <SlUserFollowing className="size-5 mr-2" />
                Following
              </button>
            </>
          )}

          {!isOwner && (
            <>
              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <ImUser className="size-5 mr-2" />
                Friends
              </a>
              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  href="/inbox">
                <ImBubble2 className="size-5 mr-2" />
                Message
              </a>
              <button
                onClick={handleFollow}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full"
              >
                {isFollow ? (
                  <>
                    <FaRegHeart className="size-5 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <ImHeart className="size-5 mr-2" />
                    Follow
                  </>
                )}
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full"
                      onClick={handleChallenge}>
                <GiBattleAxe className="size-5 mr-2" />
                Challenge
              </button>
              <a href= {`/report?username=${username}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <MdReportProblem className="size-5 mr-2"/>
                Report
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};
