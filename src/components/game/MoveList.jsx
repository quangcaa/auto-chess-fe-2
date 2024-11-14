import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import movesStore from "@/store/movesStore";

export const MoveList = () => {
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
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 text-left">#</th>
              <th className="px-2 py-1 text-left">White</th>
              <th className="px-2 py-1 text-left">Black</th>
            </tr>
          </thead>
          <tbody>
            {movePairs.map(({ moveNumber, white, black }, index) => (
              <tr
                key={moveNumber}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-2 py-1">{moveNumber}.</td>
                <td className="px-2 py-1">{white}</td>
                <td className="px-2 py-1">{black}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
