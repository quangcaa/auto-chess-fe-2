import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import movesStore from "@/store/movesStore";

export const MoveList = ({ handleViewHistory = (item) => {} }) => {
  const moves = movesStore((state) => state.moves);
  const listRef = useRef(null);

  const [movePairs, setMovePairs] = useState([]);
  useEffect(() => {
    setMovePairs(moves.map((item, index) => ({
      moveNumber: Math.floor(index / 2) + 1,
      san: item.san,
      fen: item.after,
      selected: item.selected
    })))
  }, [moves])

  // auto scroll to bottom when new moves added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [movePairs]);

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
            {movePairs.map((item, index) => (
              index % 2 == 0 &&
                <tr
                key={index}
                className={`${
                  item.moveNumber % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-1 bg-[#F7F6F5] font-semibold text-[#B3B3B3] border-r-2 flex justify-center">
                  {item.moveNumber}
                </td>
                <td className={`px-2 py-1 hover:text-white hover:bg-emerald-600 cursor-pointer ${item.selected && 'bg-emerald-600 text-white'}`} onClick={() => handleViewHistory(item.fen)}>{item.san}</td>
                {movePairs[index + 1] ? 
                
                <td className={`px-2 py-1 hover:text-white hover:bg-emerald-600 cursor-pointer ${movePairs[index + 1].selected && 'bg-emerald-600 text-white'}`} onClick={() => handleViewHistory(movePairs[index + 1].fen)}>{movePairs[index + 1].san}</td> : 
                <td ></td>
              }
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
