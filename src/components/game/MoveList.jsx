import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import movesStore from "@/store/movesStore";

export const MoveList = ({ handleViewHistory = (item) => {} }) => {
  const moves = movesStore((state) => state.moves);
  const listRef = useRef(null);

  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i].san;
    const blackMove = moves[i + 1]?.san || "";
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: whiteMove,
      black: blackMove,
      after: moves[i+1]?.after,
      before: moves[i+1]?.before || moves[i].after
    });
  }

  // auto scroll to bottom when new moves added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Move List</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent
        className="flex-grow overflow-y-auto no-scrollbar h-64 p-0 text-sm"
        ref={listRef}
      >
        <table className="table-auto w-full">
          <thead className="sticky top-0">
            <tr className="bg-gray-100">
              <th className="px-1 py-1 text-left bg-[#F7F6F5] text-[#B3B3B3] border-r-2 flex justify-center">
                #
              </th>
              <th className="px-2 py-1 text-left">White</th>
              <th className="px-2 py-1 text-left">Black</th>
            </tr>
          </thead>
          <tbody>
            {movePairs.map(({ moveNumber, white, black, after, before }, index) => (
              <tr
                key={moveNumber}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-1 bg-[#F7F6F5] font-semibold text-[#B3B3B3] border-r-2 flex justify-center">
                  {moveNumber}
                </td>
                <td className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => handleViewHistory(before)}>{white}</td>
                <td className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => handleViewHistory(after)}>{black}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
