import { useEffect, useState } from "react";
import useGetMyProfile from "../../hooks/useGetMyProfile";
import useEditProfile from "../../hooks/useEditProfile";

export const EditProfile = () => {
  const {
    profile,
    loading: loadingProfile,
    error: profileError,
  } = useGetMyProfile();
  const {
    editProfile,
    loading: loadingEdit,
    error: editError,
    success,
  } = useEditProfile();

  const [profileData, setProfileData] = useState({
    bio: "",
    real_name: "",
    location: "",
    flag: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        bio: profile.bio || "",
        real_name: profile.real_name || "",
        location: profile.location || "",
        flag: profile.flag || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editProfile(profileData);
  };

  return (
    <div className="flex flex-col bg-white p-6 w-full  rounded-md shadow-lg ">
      {/* header */}
      <div className="flex flex-col mb-3">
        <p className="text-4xl  text-red-400  p-6 rounded-lg   mb-4">
          Edit Profile
        </p>

        <p className="text-base pl-6 text-gray-600">
          All information is public and optional.
        </p>
      </div>

      {/* form */}
      <form className="flex flex-wrap pl-6" onSubmit={handleSubmit}>
        <div className="flex flex-wrap w-full">
        <div className="flex flex-col w-1/2 pr-4 pt-4">
          <label className="font-bold text-base text-gray-600 py-2 rounded-md">
            Biography
          </label>
          <textarea
            name="bio"
            className="bg-gray-200 border border-gray-300 rounded-md h-32 w-full p-3 resize-none focus:border-blue-900 transition duration-200"
            value={profileData.bio || ""}
            onChange={handleChange}
          />
          
        <p className="text-base text-gray-600">
          Talk about yourself, your interests, what you like in chess, your
          favorite openings, players, ...
        </p>
        </div>
          <div className="flex flex-col w-1/2 px-4 pt-4 ">
            <label className="font-bold text-base text-gray-600 py-2 rounded-md">
              Real name
            </label>
            <input
              type="text"
              name="real_name"
              className="bg-gray-200 border border-gray-300 rounded-md h-10 p-2 focus:border-blue-500 focus:ring  transition duration-200"
              onChange={handleChange}
              value={profileData.real_name || ""}
            />
          </div>
          <div className="flex flex-col w-1/2 pr-4 pt-4">
            <label className="font-bold text-base text-gray-600 py-2 rounded-md">
              Flag
            </label>
            <input
              type="text"
              name="flag"
              className="bg-gray-200 border border-gray-300 rounded-md h-10 p-2 focus:border-blue-500 focus:ring  transition duration-200"
              onChange={handleChange}
              value={profileData.flag || ""}
            />
          </div>
          <div className="flex flex-col w-1/2 px-4 pt-4">
            <label className="font-bold text-base text-gray-600 py-2 rounded-md">
              Location
            </label>
            <input
              type="text"
              name="location"
              className="bg-gray-200 border border-gray-300 rounded-md h-10 p-2 focus:border-blue-500 focus:ring  transition duration-200"
              onChange={handleChange}
              value={profileData.location || ""}
            />
          </div>
        </div>

        <div className="flex flex-col mt-6 w-full">
          <hr className="my-4 border-gray-300" />

          <div className="flex justify-end mb-4">
            <button
              type="submit"
              className={`bg-blue-500 text-white text-base font-semibold rounded-md py-3 px-6 shadow hover:bg-blue-600 hover:shadow-2xl transition duration-200 ${
                loadingEdit ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loadingEdit}
            >
              {loadingEdit ? "Submitting..." : "Submit"}
            </button>
          </div>

          {editError && (
            <p className="text-red-500 text-sm mt-2">{editError}</p>
          )}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </div>
      </form>
    </div>
  );
};
