import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loading } from "../Loading";

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

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

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

      navigate(`/@/${username}`);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoadingEdit(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full rounded-md shadow-lg">
      <Card className="p-6 flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center gap-4 my-2">
          <CardTitle className="text-5xl text-emerald-600">
            Edit profile
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col">
          <CardDescription className="text-base text-gray-700 mt-4 mb-6">
            All information is public and optional.
          </CardDescription>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col w-full"
          >
            <div className="flex flex-row gap-4 mb-2">
              <div className="relative mb-2 w-full">
                <Label htmlFor="bio" className="text-base font-medium">
                  Biography
                </Label>
                <div className="relative flex items-center">
                  <Textarea
                    name="bio"
                    value={profileData.bio || ""}
                    onChange={handleChange}
                    className="h-[120px] border-2 border-gray-300 text-gray-800"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Talk about yourself, your interests, what you like in chess,
                  your favorite openings, players, ...
                </p>
              </div>

              <div className="relative mb-2 w-full">
                <Label htmlFor="real_name" className="text-base font-medium">
                  Real name
                </Label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="real_name"
                    className="text-gray-800 border-2 border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none"
                    value={profileData.real_name || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-4 mb-2">
              <div className="relative mb-2 w-full">
                <Label htmlFor="flag" className="text-base font-medium">
                  Country
                </Label>
                <div className="relative flex items-center">
                  <Select
                    onValueChange={handleFlagChange}
                    value={profileData.flag}
                  >
                    <SelectTrigger className="border border-2 border-gray-300 focus:border-emerald-600 h-[52px] p-3 flex flex-row items-center">
                      <SelectValue
                        placeholder={profileData.flag || "Select your country"}
                      />
                    </SelectTrigger>
                    <SelectContent className="shadow-lg mt-1 max-h-60 overflow-auto">
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.label}
                          className="font-base text-gray-800 cursor-pointer transition-colors duration-200"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative mb-2 w-full">
                <Label htmlFor="location" className="text-base font-medium">
                  Location
                </Label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="location"
                    className="border border-2 border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none"
                    onChange={handleChange}
                    value={profileData.location || ""}
                  />
                </div>
              </div>
            </div>

            <div className="my-4">
              <Separator />
            </div>

            <div className="w-full flex justify-end">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className={`bg-emerald-600 text-white text-[15px] shadow-lg ${
                  loadingEdit
                    ? "cursor-not-allowed"
                    : "hover:bg-emerald-800 focus:ring-emerald-500"
                }`}
                disabled={loadingEdit}
              >
                {loadingEdit ? "SUBMITTING..." : "SUBMIT"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
