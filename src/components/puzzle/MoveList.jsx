import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import movesStore from "@/store/movesStore";

export const MoveList = ({
  handleViewHistory = (item, index) => {},
  selected = 0,
}) => {
  const moves = movesStore((state) => state.moves);
  const listRef = useRef(null);

  // auto scroll to bottom when new moves added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <Card className="w-full h-full shadow-lg flex flex-col rounded-lg">
      <CardContent
        className="flex-grow overflow-y-auto no-scrollbar h-64 p-0 text-sm rounded-lg"
        ref={listRef}
      >
        <table className="table-auto w-full rounded-xl">
          <thead className="sticky top-0">
            <tr className="bg-[#779952]">
              <th className="px-1 py-1 text-left text-white flex justify-center">
                #
              </th>
              <th className="px-2 py-1 text-left text-white">White</th>
              <th className="px-2 py-1 text-left text-white ">Black</th>
            </tr>
          </thead>
          <tbody>
            {moves.map(
              (item, index) =>
                index % 2 === 0 && (
                  <tr
                    key={index}
                    className={`${
                      (index / 2 + 1) % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-1 bg-[#F7F6F5] font-semibold text-[#B3B3B3] border-r-2 flex justify-center">
                      {index / 2 + 1}
                    </td>
                    <td
                      className={`px-2 py-1 hover:text-white hover:bg-[#779952] cursor-pointer ${
                        index === selected && "bg-[#c0dba3] font-bold"
                      }`}
                      onClick={() => handleViewHistory(item, index)}
                    >
                      {item.san}
                    </td>
                    {moves[index + 1] && (
                      <td
                        className={`px-2 py-1 hover:text-white hover:bg-[#779952] cursor-pointer ${
                          index + 1 === selected && "bg-[#c0dba3] font-bold"
                        }`}
                        onClick={() =>
                          handleViewHistory(moves[index + 1], index + 1)
                        }
                      >
                        {moves[index + 1].san}
                      </td>
                    )}
                  </tr>
                )
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
