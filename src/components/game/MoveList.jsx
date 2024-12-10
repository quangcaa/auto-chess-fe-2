import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";

export const MoveList = ({ moves, handleViewHistory, selected, isGameOver, end }) => {
  const listRef = useRef(null);

  // auto scroll to bottom when new moves added
  useEffect(() => {
    if (listRef.current && !isGameOver) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <Card className={`w-full h-full flex flex-col ${end ? "" : "!border-0 !rounded-none"}`}>
      {/* <CardHeader>
        <CardTitle>Move List</CardTitle>
      </CardHeader> */}
      {/* <Separator /> */}
      <CardContent
        className={`flex-grow overflow-y-auto no-scrollbar h-64 p-0 text-sm ${end ? "rounded-lg" : ""}`}
        ref={listRef}
      >
        <table className={`table-auto w-full ${end ? "rounded-xl" : ""}`}>
          <thead className={`sticky top-0 ${end ? "rounded-xl" : ""}`}>
            <tr className="bg-[#779952]">
              <th className="px-1 py-1 text-left text-white flex justify-center">
                #
              </th>
              <th className="px-2 py-1 text-left text-white">White</th>
              <th className="px-2 py-1 text-left text-white">Black</th>
            </tr>
          </thead>
          <tbody>
            {moves.map(
              (move, index) =>
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
                      onClick={() => handleViewHistory(move, index)}
                    >
                      {move}
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
                        {moves[index + 1]}
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

MoveList.propTypes = {
  moves: PropTypes.array.isRequired,
  handleViewHistory: PropTypes.func,
  selected: PropTypes.number,
  isGameOver: PropTypes.bool.isRequired,
};
