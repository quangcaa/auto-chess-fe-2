import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Dropdown from '@/components/profile/Dropdown';
import api from '@/utils/axios';
import { useParams } from 'react-router-dom';
import { GiBurningEmbers } from "react-icons/gi";
import { GiCrossedSwords } from "react-icons/gi";
import { Chessboard } from 'react-chessboard';

export function Profile() {

  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { username } = useParams();
  const currentUser = localStorage.getItem('username');
  

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`@/${username}`);

        // const Pdata = response.data.profile;
        // console.log(Pdata);

        setProfile(response.data.profile);
        setGames(response.data.games);
      } catch (err) {
        setError('Error fetching user profile');
        console.error(err);
      }
    };


    const fetchFollowingList = async () => {
      try {
        const response = await api.get(`@/${username}/following`);

        const Fdata = await response.data;
        console.log('get follow');
        console.log(username);
        console.log(Fdata.followingList);


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

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
  };

  const checkFollow = () => {
    if (followingList.length === 0) {
      return false;
    }
    const current_id = localStorage.getItem('user_id');
    console.log(current_id);
    return followingList.some((follow) => current_id === follow.following_id);
  };

  // const checkIsOwner = () => {
  //   return username === currentUser;
  // }


  return (
    <div className="w-[1200px] mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="bg-gray-100 p-4">


        <div className='flex'>
          <img src='/online.png' className='w-6 h-6 mr-4' />
          <h2 className="text-lg font-semibold text-gray-800">{profile?.username || username}</h2>
        </div>

        {/* <p className="text-sm text-gray-600">{profileData.info}</p> */}
        <div className='flex gap-4'>
          <div className="flex flex-col justify-center items-center space-x-2 w-30 h-20 ">
            <h2>{games.length}</h2>
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
            <h2>rated</h2>
          </div>

          <div className='ml-auto'>
            <Dropdown
              isOwner={username === currentUser}
              isFollowing={!(username === currentUser) && checkFollow()}
              user_id={profile?.user_id}
            />
          </div>

        </div>
      </div>

      {/* Body */}
      <div className="flex h-[400px] p-4 border-t border-b border-gray-200 overflow-hidden">
        <div className="flex-1 pr-4" >
          <h2>chart</h2>
        </div>

        <div className="w-[400px] pl-4 border-l border-gray-300 overflow-y-auto">
          <ScrollArea>
            <div >
              <strong>{profile?.real_name || username}</strong>
              <p className='italic'>{profile?.bio}</p>
              <div className='mt-6'>
                <span>{profile?.location}</span>
                <span>, {profile?.flag}</span>
                <p>
                  Member since {formatDate(profile?.joined_date)}
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>


      {/* Footer */}
      <div className="p-4 bg-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">History games</h3>
        <div className='flex justify-center '>
          <button className="w-[400px] h-[50px] bg-transparent text-gray-800  hover:bg-blue-200  hover:shadow-lg transition-all duration-300 rounded-md">
            All
          </button>
          <button className="w-[400px] h-[50px] bg-transparent text-gray-800  hover:bg-blue-200  hover:shadow-lg transition-all duration-300 rounded-md">
            Win
          </button>
          <button className="w-[400px] h-[50px] bg-transparent text-gray-800  hover:bg-blue-200  hover:shadow-lg transition-all duration-300 rounded-md">
            Lose
          </button>
        </div>

        <ul className="space-y-1">
          {games.map((game, index) => (
            <li
              key={index}
              className={`text-sm text-gray-600 flex  p-2 hover:bg-blue-200 rounded-md ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              <div className='w-[220px] h-[200px]'>
                <Chessboard position={game.current_fen || "start"} boardWidth={200} />
              </div>
              <div className='flex-1'>
                <div className='flex gap-x-3'>
                  <GiBurningEmbers className='size-12' />
                  <div >
                    <strong className='flex gap-x-3 text-lg'>
                      <p>{game.time_control_id}</p>
                      <p>•</p>
                      <p>{game.variant_id}</p>
                    </strong>
                    <time className="block " dateTime={game.start_time}>{formatDate(game.start_time)}</time>
                  </div>
                </div>

                <div className='flex justify-center mt-2'>
                  <p>{game.white_player_id}</p>
                  <GiCrossedSwords className='size-6' />
                  <p>{game.black_player_id}</p>
                </div>
                <div className='flex justify-center items-center mt-2'>{game.status} • {game.result}</div>
              </div>

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}


