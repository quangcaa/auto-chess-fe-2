import { useEffect, useState, useMemo } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import countryList from "react-select-country-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    bio: "",
    real_name: "",
    location: "",
    flag: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const options = useMemo(() => countryList().getData(), []);

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

  const handleFlagChange = (value) => {
    setProfileData((prevData) => ({
      ...prevData,
      flag: value,
    }));
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
            {/* <textarea
              name="bio"
              className="bg-gray-200 border border-gray-300 rounded-md h-32 w-full p-3 resize-none focus:border-blue-900 transition duration-200"
              value={profileData.bio || ""}
              onChange={handleChange}
            />

            <p className="text-base text-gray-600">
              Talk about yourself, your interests, what you like in chess, your
              favorite openings, players, ...
            </p> */}
            <textarea
              name="bio"
              className="bg-gray-200 border border-gray-300 rounded-md h-32 w-full p-3 resize-none focus:border-blue-900 transition duration-200"
              value={profileData.bio || ""}
              onChange={handleChange}
              placeholder="Talk about yourself, your interests, what you like in chess, your favorite openings, players, ..."
            />
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
            <Select onValueChange={handleFlagChange} value={profileData.flag}>
              <SelectTrigger className="w-[480px] p-2 border bg-gray-200 border-gray-300 rounded-md ">
                <SelectValue
                  placeholder={profileData.flag || "Select your country"}
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.label}
                    className="p-2 text-gray-800 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
      </form>
    </div>
  );
};
