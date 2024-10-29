import { useEffect, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";

export const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    bio: "",
    real_name: "",
    location: "",
    flag: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/account/my-profile");
        const { profile } = res.data;
        setProfileData({
          bio: profile.bio || "",
          real_name: profile.real_name || "",
          location: profile.location || "",
          flag: profile.flag || "",
        });
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);

    try {
      const res = await api.put("/account/edit-profile", profileData);

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoadingEdit(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col bg-white p-8 w-full mx-auto rounded shadow-lg">
      {/* header */}
      <div className="flex flex-col mb-3">
        <p className="text-3xl text-red-500">Edit Profile</p>
        <p className="text-sm">All information is public and optional.</p>
      </div>

      {/* form */}
      <form className="flex flex-wrap" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full">
          <label className="font-bold m</div>t-2 text-sm">Biography</label>
          <textarea
            name="bio"
            className="bg-gray-200 border-none rounded-md h-16 w-full"
            value={profileData.bio || ""}
            onChange={handleChange}
          />
        </div>
        <p className="text-sm">
          Talk about yourself, your interests, what you like in chess, your
          favorite openings, players, ...
        </p>

        <div className="flex flex-wrap w-full">
          <div className="flex flex-col w-1/2 pr-2">
            <label className="font-bold mt-2 text-sm">Username</label>
            <input
              type="text"
              name="username"
              className="bg-gray-200 border-none rounded-md h-8"
              onChange={handleChange}
              value={profileData.username}
            />
          </div>
          <div className="flex flex-col w-1/2 pl-2">
            <label className="font-bold mt-2 text-sm">Real Name</label>
            <input
              type="text"
              name="real_name"
              className="bg-gray-200 border-none rounded-md h-8"
              onChange={handleChange}
              value={profileData.real_name}
            />
          </div>
          <div className="flex flex-col w-1/2 pr-2">
            <label className="font-bold mt-2 text-sm">Region or Country</label>
            <input
              type="text"
              name="region"
              className="bg-gray-200 border-none rounded-md h-8"
              onChange={handleChange}
              value={""}
            />
          </div>
          <div className="flex flex-col w-1/2 pl-2">
            <label className="font-bold mt-2 text-sm">Location</label>
            <input
              type="text"
              name="location"
              className="bg-gray-200 border-none rounded-md h-8"
              onChange={handleChange}
              value={profileData.location}
            />
          </div>
        </div>

        <div className="flex flex-col mt-4 w-full">
          <hr className="my-2" />
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-500 text-white text-sm font-bold rounded-md py-2 px-4 ${
                loadingEdit ? "disabled" : ""
              }`}
              disabled={loadingEdit}
            >
              {loadingEdit ? "CHANGING..." : "SUBMIT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
