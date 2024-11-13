import { Board } from "@/components/game/Board";
import { ChatRoom } from "@/components/game/ChatRoom";
import { Button } from "@/components/ui/button";

export const Puzzle = () => {
  // return <ChatRoom />;

  return (
    <div className=" flex justify-center items-center">
      <Board />
    </div>
  );
};
