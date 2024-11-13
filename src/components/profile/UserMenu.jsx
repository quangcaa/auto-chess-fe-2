import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from 'axios';
import Dropdown from './Dropdown';

function ProfileComponent() {
  //hardcode
  const [profileData, setProfileData] = useState({
    name: "",
    info: "",
    quote: "",
    history: [],
  });

  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem('username');

  
  console.log(username);

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/@/${username}`);
        setProfile(response.data.profile);
        setGames(response.data.games);
      } catch (err) {
        setError('Error fetching user profile');
        console.error(err);
      }
    };


    const fetchFollowingList = async () => {
      try {
        const response = await axios.get(`/@/${username}/following`, {
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          },
        });
        setFollowingList(response.data.followingList);
      } catch (err) {
        setError('Error fetching following list');
        console.error(err);
      }
    };

    // Call 2 APIs
    fetchUserProfile();
    fetchFollowingList();


    setLoading(false);
  }, [username]);



  useEffect(() => {

    //hard code for test
    setProfileData({
      name: "Lê Quang Liêm's",
      info: "Đại kiện tướng cờ vua Việt Nam",
      quote: "Nên cờ vua chứ đừng cờ bạc.",
      history: [
        { game_id: 1, rated: 1000, white_player_id: 1, black_player_id: 2, date: "2024-01-10", result: "Win" },
        { game_id: 1, rated: 1000, white_player_id: 1, black_player_id: 2, date: "2024-02-05", result: "Lose" },
        { game_id: 1, rated: 1000, white_player_id: 1, black_player_id: 2, date: "2024-03-18", result: "Win" },
      ],
      history_game: [
        { game_id: 1, rated: 1000, white_player_id: 1, black_player_id: 2 }
      ]
    });
  }, []);

  return (
    <div className="w-[1200px] mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="bg-gray-100 p-4">


        <div className='flex'>
          <img src='/online.png' className='w-6 h-6 mr-4' />
          <h2 className="text-lg font-semibold text-gray-800">{username}</h2>
        </div>

        {/* <p className="text-sm text-gray-600">{profileData.info}</p> */}
        <div className='flex gap-4'>
          <div className="flex flex-col justify-center items-center space-x-2 w-30 h-20 ">
            <h2>300</h2>
            <h2>Games</h2>
          </div>

          <div className="flex flex-col justify-center items-center space-x-2 w-30 h-20  ">
            <h2>69</h2>
            <h2>Followers</h2>
          </div>

          <div className="flex flex-col justify-center items-center space-x-2 w-30 h-20  ">
            <h2>300</h2>
            <h2>Forum Posts</h2>
          </div>

          <div className="flex flex-col justify-center items-center space-x-2 w-30 h-20  ">
            <h2>300</h2>
            <h2>games</h2>
          </div>

          <div className='ml-auto'>
            <Dropdown />
          </div>

        </div>
      </div>

      {/* Body */}
      <div className="flex h-[400px] p-4 border-t border-b border-gray-200 overflow-hidden">
        <div className="flex-1 pr-4">
          <h2>chart</h2>
        </div>

        <div className="w-[400px] pl-4 border-l border-gray-300 overflow-y-auto">
          <ScrollArea>
            <blockquote className="italic text-gray-700">{profileData.quote}</blockquote>
          </ScrollArea>
        </div>
      </div>


      {/* Footer */}
      <div className="p-4 bg-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">History games</h3>
        <div className='flex justify-center '>
          <button className="w-[400px] h-[50px] bg-transparent text-gray-800  hover:bg-blue-200  hover:shadow-lg transition-all duration-300">
            All
          </button>
          <button className="w-[400px] h-[50px] bg-transparent text-gray-800  hover:bg-blue-200  hover:shadow-lg transition-all duration-300">
            Win
          </button>
          <button className="w-[400px] h-[50px] bg-transparent text-gray-800  hover:bg-blue-200  hover:shadow-lg transition-all duration-300">
            Lose
          </button>
        </div>

        <ul className="space-y-1">
          {profileData.history.map((game, index) => (
            <li
              key={index}
              className={`text-sm text-gray-600 flex justify-between p-2 hover:bg-blue-200 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              <img src='/chess.png' className='w-[200px] h-[200px]' />
              <span>Ngày: {game.date}</span>
              <span>Kết quả: {game.result}</span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default ProfileComponent;
