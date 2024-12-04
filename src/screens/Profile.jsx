import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { Chessboard } from "react-chessboard";

import { GiBurningEmbers } from "react-icons/gi";
import { GiCrossedSwords } from "react-icons/gi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dropdown } from "@/components/profile/Dropdown";
import { HistoryGames } from "../components/profile/HistoryGames";
import { Loading } from "@/components/Loading";
import { Online } from "../components/Online";
import { Offline } from "../components/Offline";

export function Profile() {
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { username } = useParams();
  const currentUser = localStorage.getItem("username");
  const [flagUrl, setFlagUrl] = useState("");
  const { onlineUsers } = useOnlineUsers();
  const { socket } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`@/${username}`);

        console.log(response)

        setProfile(response.data.profile);
        setGames(response.data.games);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    const fetchFollowingList = async () => {
      try {
        const response = await api.get(`@/${username}/following`);
        const data = response.data;
        setFollowingList(data);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    const fetchFollowerList = async () => {
      try {
        const response = await api.get(`@/${username}/follower`);
        const data = response.data;
        setFollowerList(data);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    // Call 2 APIs
    fetchUserProfile();
    fetchFollowingList();
    fetchFollowerList();

    setLoading(false);
  }, [username]);

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${profile?.flag}`
        );
        if (!response.ok) throw new Error("country not found");
        const data = await response.json();
        setFlagUrl(data[0]?.flags?.png);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (profile?.flag) fetchFlag();
  }, [profile?.flag]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", options);
  };

  const checkFollow = () => {
    if (followingList.length === 0) {
      return false;
    }
    const current_id = localStorage.getItem("user_id");
    console.log(current_id);
    return followingList.some((follow) => current_id === follow.following_id);
  };

  // const checkIsOwner = () => {
  //   return username === currentUser;
  // }

  if (loading) return <Loading />;

  return (
    <div className="w-full flex justify-center items-center pt-2">
      <div className="w-[70%] bg-white mx-auto overflow-hidden rounded-lg border border-gray-300 shadow-lg mb-8">
        {/* Header */}
        <div className="bg-gray-100">
          <div className="flex flex-row px-8 pt-7 pb-4">
            <div className="w-6 h-6 place-self-center">
              {profile?.online ? <Online /> : <Offline />}
            </div>
            <div className="text-3xl text-gray-700 mx-3">
              {profile?.username || username}
            </div>
          </div>

          <div className="flex flex-row gap-2 px-8 pb-2">
            <div className="flex flex-col items-center w-30 text-sm text-gray-700">
              <p>{games.length}</p>
              <p>Games</p>
            </div>

            <div className="flex flex-col items-center w-30 text-sm text-gray-700 ">
              <p>{followerList.length || 0}</p>
              <p>Followers</p>
            </div>

            <div className="flex flex-col items-center w-30 text-sm text-gray-700 ">
              <h2>300</h2>
              <h2>Forum Posts</h2>
            </div>

            <div className="ml-auto">
              <Dropdown
                isOwner={username === currentUser}
                isFollowing={!(username === currentUser) && checkFollow()}
                user_id={profile?.user_id}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex h-[350px] p-4 border-t border-b border-gray-200 overflow-hidden">
          <div className="flex-1 pr-4">
            <p>chart</p>
          </div>

          <div className="w-2/5 pl-4 border-l border-gray-300 overflow-y-auto">
            <ScrollArea>
              <div className="text-gray-700">
                <p className="text-lg font-semibold">
                  {profile?.real_name || username}
                </p>
                <div className="mt-2 flex flex-row gap-1 items-center">
                  <span>{profile?.location}</span>
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`${profile?.location} flag`}
                      className="w-6 h-4"
                    />
                  )}
                  <span>{profile?.flag}</span>
                </div>
                <p>Member since {formatDate(profile?.joined_date)}</p>
                <p className="italic mt-2">{profile?.bio}</p>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100">
          <div className="text-lg font-semibold text-gray-700 text-center py-3">
            History games
          </div>
          <div className="flex justify-center">
            <button className="w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300">
              All
            </button>
            <button className="w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300">
              Rated
            </button>
            <button className="w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300">
              Win
            </button>
            <button className="w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300">
              Lose
            </button>
          </div>

          <ul className="space-y-1">
            {games.map((game, index) => (
              <li
                key={index}
                className={`text-sm text-gray-600 flex  p-2 hover:bg-blue-200 rounded-md ${
                  index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                }`}
              >
                <div className="w-[220px] h-[200px]">
                  <Chessboard position={game.fen || "start"} boardWidth={200} />
                </div>
                <div className="flex-1">
                  <div className="flex gap-x-3">
                    <GiBurningEmbers className="size-12" />
                    <div>
                      <strong className="flex gap-x-3 text-lg">
                        <p>{game.time_control_id}</p>
                        <p>•</p>
                        <p>{game.variant_id}</p>
                      </strong>
                      <time className="block " dateTime={game.start_time}>
                        {formatDate(game.start_time)}
                      </time>
                    </div>
                  </div>

                  <div className="flex justify-center mt-2">
                    <p>{game.white_player_id}</p>
                    <GiCrossedSwords className="size-6" />
                    <p>{game.black_player_id}</p>
                  </div>
                  <div className="flex justify-center items-center mt-2">
                    {game.status} • {game.result}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* <HistoryGames games={games} /> */}
      </div>
    </div>
  );
}
