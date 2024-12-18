import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/axios";
import toast from "react-hot-toast";
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followType, setFollowType] = useState("follower");

  console.log(followType);

  const { username } = useParams();
  const currentUser = localStorage.getItem("username");
  const current_id = localStorage.getItem("user_id");
  const [flagUrl, setFlagUrl] = useState("");

  useEffect(() => {
    setLoading(true);
    let isMounted = true; // Để tránh cập nhật state sau khi unmount

    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`@/${username}`);
        console.log(response.data);
        if (isMounted) {
          setProfile(response.data.profile);
          setGames(response.data.games);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    const fetchFollowingList = async () => {
      try {
        const response = await api.get(`@/${username}/following`);
        if (isMounted) {
          setFollowingList(response.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    const fetchFollowerList = async () => {
      try {
        const response = await api.get(`@/${username}/follower`);
        if (isMounted) {
          setFollowerList(response.data);
          if (response.data.length > 0) {
            setIsFollowing(
              response.data.some(
                (follow) => current_id === String(follow.follower_id)
              )
            );
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchUserProfile(),
        fetchFollowingList(),
        fetchFollowerList(),
      ]);
      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
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
    return isFollowing;
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full flex justify-center items-center pt-4">
      <div className="w-[70%] bg-white mx-auto overflow-hidden rounded-lg border border-gray-300 shadow-lg mb-8">
        {/* Header */}
        <div className="bg-gray-100">
          <div className="flex flex-row px-8 pt-7 pb-4">
            <div className="w-6 h-6 place-self-center">
              {profile?.online ? <Online /> : <Offline />}
            </div>
            <div className="text-3xl text-gray-800 mx-3 font-bold">
              {profile?.username || username}
            </div>
          </div>
          <div className="flex flex-row gap-4 px-8 pb-4">
            <div className="flex flex-col items-center w-30 text-sm text-gray-700">
              <p className="text-lg font-semibold">{games.length}</p>
              <p>Games</p>
            </div>
            <div className="flex flex-col items-center w-30 text-sm text-gray-700">
              <p className="text-lg font-semibold">
                {followerList.length || 0}
              </p>
              <p>Followers</p>
            </div>
            {/* <div className="flex flex-col items-center w-30 text-sm text-gray-700">
              <p className="text-lg font-semibold">{profile.post_count || 0}</p>
              <p>Forum Posts</p>
            </div> */}
            <div className="ml-auto">
              <Dropdown
                isOwner={username === currentUser}
                isFollowing={checkFollow}
                user_id={profile?.user_id}
                setFollowType={setFollowType}
              />
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="flex h-[350px] p-6 border-t border-b border-gray-200">
          <div className="w-[70%] pr-6">
            <ScrollArea>
              <div className="text-gray-800">
                <p className="text-xl font-semibold">
                  {profile?.real_name || username}
                </p>
                <div className="mt-3 flex flex-row gap-2 items-center text-sm">
                  <span>{profile?.location}</span>
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`${profile?.location} flag`}
                      className="w-6 h-4 rounded-md"
                    />
                  )}
                  <span>{profile?.flag}</span>
                </div>
                <p className="mt-3 text-gray-600">
                  Member since {formatDate(profile?.joined_date)}
                </p>
                <p className="italic mt-4 text-gray-700">{profile?.bio}</p>
              </div>
            </ScrollArea>
          </div>
          <div className="w-[30%] pl-6 border-l border-gray-300 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {followType === "follower" ? "Follower" : "Following"}
            </h3>
            <ScrollArea>
              {(followType === "follower" ? followerList : followingList).map(
                (follow, index) => (
                  <a
                    key={index}
                    href={`/@/${follow.username}`}
                    className="flex items-center block text-sm mb-2 space-x-2 hover:text-emerald-600"
                  >
                    <div className="flex gap-2">
                      <div className="w-4 h-4 place-self-center">
                        {follow.online ? <Online /> : <Offline />}
                      </div>
                      <div className="text-lg">{follow.username}</div>
                    </div>
                  </a>
                )
              )}
            </ScrollArea>
          </div>
        </div>
        {/* Footer */}
        <HistoryGames games={games} />
      </div>
    </div>
  );
}
