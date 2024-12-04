import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loading } from "@/components/Loading";
import { GiRabbit } from "react-icons/gi";
import { FaRegCircle, FaCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import toast from "react-hot-toast";

export const GameInfo = ({ white, black, type }) => {
  const [whiteMetadata, setWhiteMetadata] = useState(false);
  const [blackMetadata, setBlackMetadata] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!white || !black) return;

      try {
        const [whiteResponse, blackResponse] = await Promise.all([
          api.get(`/@/${white}/public`),
          api.get(`/@/${black}/public`),
        ]);

        setWhiteMetadata(whiteResponse.data.user);
        setBlackMetadata(blackResponse.data.user);
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    fetchUserInfo();
  }, [black, white]);

  if (!white || !black) {
    return <Loading />;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row gap-4 p-[21px] pb-2">
        <div>
          <GiRabbit className="size-12 text-gray-800" />
        </div>
        <div>
          <CardDescription className="text-base text-gray-800">
            10+0 • Rated • Rapid
          </CardDescription>
          <CardDescription className="text-gray-800">
            4 hours ago
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center gap-2">
          <FaRegCircle className="text-gray-700" />
          <p className="text-gray-700">
            <span className="font-medium">{whiteMetadata.username}</span>
          </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <FaCircle className="text-gray-700" />
          <p className="text-gray-700">
            <span className="font-medium">{blackMetadata.username}</span>
          </p>
        </div>
      </CardContent>
      <Separator />
    </Card>
  );
};
