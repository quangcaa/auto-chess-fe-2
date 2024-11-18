import { useState } from "react";
import { TfiMenu } from "react-icons/tfi";
import { IoMdSettings } from "react-icons/io";
import { ImUser } from "react-icons/im";
import { ImBubble2, ImHeart } from "react-icons/im";
import { GiBattleAxe } from "react-icons/gi";

const Dropdown = ({ isOwner = true }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }


    return (
        <div className="relative inline-block text-left">
            <span onClick={toggleDropdown}
                className={`cursor-pointer text-base transition duration-300 px-3 py-5 flex items-center ${isOpen ? "bg-white" : "bg-transparent"
                    }`}>
                <TfiMenu></TfiMenu>
            </span>

            {isOpen && (
                <div className="absolute right-0 z-10 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                <ImHeart className="size-5 mr-2" />
                                Follow
                            </a>
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                <GiBattleAxe className="size-5 mr-2" />
                                Challenge to a game
                            </a>
                        </>
                    )}

                </div>
            )}
        </div>
    )
}

export default Dropdown;