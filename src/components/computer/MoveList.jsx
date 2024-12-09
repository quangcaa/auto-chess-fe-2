import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const MoveList = ({ moves, handleViewHistory, selected }) => {
  const listRef = useRef(null);

  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i];
    const blackMove = moves[i + 1] || "";
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: whiteMove,
      black: blackMove,
    });
  }

  // Auto scroll to bottom when new moves are added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardContent
        className="flex-grow overflow-y-auto no-scrollbar h-80 p-0 text-sm rounded-lg"
        ref={listRef}
      >
        <table className="table-auto w-full rounded-xl">
          <thead className="sticky top-0 rounded-xl">
            <tr className="bg-[#779952]">
              <th className="px-1 py-1 text-left text-white flex justify-center">
                #
              </th>
              <th className="px-2 py-1 text-left text-white">White</th>
              <th className="px-2 py-1 text-left text-white">Black</th>
            </tr>
          </thead>
          <tbody>
            {movePairs.map(({ moveNumber, white, black }, index) => (
              <tr
                key={moveNumber}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="py-1 bg-[#F7F6F5] font-semibold text-[#B3B3B3] border-r-2 flex justify-center">
                  {moveNumber}
                </td>
                <td
                  className={`px-2 py-1 hover:text-white hover:bg-emerald-600 cursor-pointer ${
                    selected === index * 2 && "bg-emerald-300 font-bold"
                  }`}
                  onClick={() => handleViewHistory(white, index * 2)}
                >
                  {white}
                </td>
                <td
                  className={`px-2 py-1 hover:text-white hover:bg-emerald-600 cursor-pointer ${
                    selected === index * 2 + 1 && "bg-emerald-300 font-bold"
                  }`}
                  onClick={() => handleViewHistory(black, index * 2 + 1)}
                >
                  {black}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
MoveList.propTypes = {
  moves: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleViewHistory: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired,
};
