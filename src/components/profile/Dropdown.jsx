import { useState } from "react";
import { TfiMenu } from "react-icons/tfi";
import { IoMdSettings } from "react-icons/io";
import { ImBubble2, ImHeart, ImUser } from "react-icons/im";
import { GiBattleAxe } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Dropdown = ({ isOwner = true, isFollowing = false, user_id }) => {
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
              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <ImUser className="size-5 mr-2" />
                Friends
              </a>
            </>
          )}

          {!isOwner && (
            <>
              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <ImUser className="size-5 mr-2" />
                Friends
              </a>
              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <ImBubble2 className="size-5 mr-2" />
                Compose Message
              </a>
              <button
                onClick={handleFollow}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
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
              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <GiBattleAxe className="size-5 mr-2" />
                Challenge to a game
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
