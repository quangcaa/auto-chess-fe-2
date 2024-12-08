import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Loading } from "@/components/Loading";
import { FaRegCircle, FaCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { GiBulletBill, GiTurtle, GiFireBowl, GiRabbit } from "react-icons/gi";

export const GameInfo = ({ white, black, clock, startTime }) => {
  if (!white || !black || !clock) {
    return <Loading />;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row gap-4 p-[21px] pb-2">
        <div className="text-gray-600">
          {clock.time_control_name === "Bullet" ? (
            <GiBulletBill className="size-12 text-yellow-500" />
          ) : clock.time_control_name === "Classical" ? (
            <GiTurtle className="size-12 text-green-600" />
          ) : clock.time_control_name === "Blitz" ? (
            <GiFireBowl className="size-12 text-red-500" />
          ) : (
            <GiRabbit className="size-12" />
          )}
        </div>

        <div>
          <CardDescription className="text-lg text-gray-700 font-semibold">
            {clock.base_time / 60000}+{clock.increment_by_turn / 1000} •{" "}
            {clock.time_control_name}
          </CardDescription>
          <CardDescription className="text-gray-600 text-sm">
            {formatDistanceToNow(new Date(startTime), {
              addSuffix: true,
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 ml-1">
        <div className="flex flex-row items-center gap-2">
          <FaRegCircle className="text-gray-600" />
          <p className="text-gray-600">
            <span className="font-medium">{white.username}</span>
          </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <FaCircle className="text-gray-600" />
          <p className="text-gray-600">
            <span className="font-medium">{black.username}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

GameInfo.propTypes = {
  white: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
  }).isRequired,
  black: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
  }).isRequired,
  clock: PropTypes.shape({
    base_time: PropTypes.number.isRequired,
    increment_by_turn: PropTypes.number.isRequired,
    time_control_name: PropTypes.string.isRequired,
  }).isRequired,
};
