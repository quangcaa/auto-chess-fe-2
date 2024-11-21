import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { useAuth } from "../../contexts/AuthContext";
import { PiWarningCircleFill } from "react-icons/pi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const CloseAccount = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.delete("/account/close-account", {
        data: { password },
      });
      const data = res.data;

      toast.success(data.message);

      logout();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full rounded-lg shadow-lg">
      <Card className="p-6 flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center gap-4 my-2">
          <PiWarningCircleFill className="size-12 text-red-500" />
          <CardTitle className="text-5xl text-red-600">Close Account</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col">
          <CardDescription className="text-lg text-gray-700 mb-2">
            Are you sure you want to close your account?
          </CardDescription>
          <CardDescription className="text-lg text-gray-700 mb-4">
            Closing your account is a permanent decision. You will NEVER be able
            to log in EVER AGAIN.
          </CardDescription>

          <Label htmlFor="password" className="text-base font-medium mb-2">
            Password
          </Label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-red-600 focus:border-2 focus:outline-none focus:ring-opacity-30"
            />
            <span
              className="absolute right-3.5 cursor-pointer text-lg"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </CardContent>

        <div className="my-4 mx-4">
          <Separator />
        </div>

        <CardFooter className="px-4 pb-4">
          <div className=" w-full flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="lg"
                  className={`bg-red-600 text-white text-[15px] hover:bg-red-800 shadow-lg`}
                  disabled={loading}
                >
                  {loading ? "CLOSING..." : "CLOSE ACCOUNT"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Confirm Account Closure
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to close your account? This action is
                    irreversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex justify-end gap-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "CLOSING..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
