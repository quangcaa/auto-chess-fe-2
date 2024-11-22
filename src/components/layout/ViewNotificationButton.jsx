import { GoBellFill } from "react-icons/go";

export const ViewNotificationButton = () => {
  return (
    <div className="flex items-center justify-center h-full cursor-pointer hover:text-emerald-600">
      <GoBellFill className="size-6 mx-2" />
    </div>
  );
};
