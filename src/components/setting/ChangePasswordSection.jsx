import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { IoInformationCircleOutline } from "react-icons/io5";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypeNewPassword, setShowRetypeNewPassword] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch("/account/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        retype_new_password: retypeNewPassword,
      });
      const data = res.data;

      toast.success(data.message);

      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-lg shadow-lg">
      <Card className="p-6 flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center gap-4 my-2">
          <CardTitle className="text-5xl text-red-600">
            Change password
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col">
          <div className="flex flex-row items-center bg-yellow-600 rounded-lg px-2 py-1 gap-2 mb-4">
            <IoInformationCircleOutline className="size-8 text-white" />
            <CardDescription className="text-base text-white">
              Do not set a password suggested by someone else. They will use it
              to steal your account.
            </CardDescription>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col w-full"
          >
            {/* CURRENT PASSWORD */}
            <div className="relative mb-2">
              <Label htmlFor="password" className="text-base font-medium">
                Current password
              </Label>
              <div className="relative flex items-center">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-lg text-[#555]"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="relative mb-2">
              <Label htmlFor="password" className="text-base font-medium">
                New password
              </Label>
              <div className="relative flex items-center">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-lg text-[#555]"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* NEW PASSWORD (AGAIN) */}
            <div className="relative mb-5">
              <Label
                htmlFor="confirmPassword"
                className="text-base font-medium"
              >
                New password (again)
              </Label>
              <div className="relative flex items-center">
                <input
                  type={showRetypeNewPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none"
                  value={retypeNewPassword}
                  onChange={(e) => setRetypeNewPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-lg text-[#555]"
                  onClick={() =>
                    setShowRetypeNewPassword(!showRetypeNewPassword)
                  }
                >
                  {showRetypeNewPassword ? "🙈" : "👁️"}
                </span>
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
                  loading
                    ? "cursor-not-allowed"
                    : "hover:bg-emerald-800 focus:ring-emerald-500"
                }`}
                disabled={loading}
              >
                {loading ? "SUBMITTING..." : "SUBMIT"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
