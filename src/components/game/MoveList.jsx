import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import movesStore from "@/store/movesStore";

export const MoveList = () => {
  // Get moves from Zustand store
  const moves = movesStore((state) => state.moves);

  console.log(`moves:: `, moves);

  // Process moves into pairs (white and black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i].san; // Using 'san' for Standard Algebraic Notation
    const blackMove = moves[i + 1]?.san || ""; // Handle cases where the game ends on white's move
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: whiteMove,
      black: blackMove,
    });
  }

  console.log(movePairs);

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Move List</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <ol className="list-decimal pl-4">
          {movePairs.map(({ moveNumber, white, black }) => (
            <li key={moveNumber} className="mb-2 flex">
              <span className="mr-2 font-semibold">{moveNumber}.</span>
              <span className="w-1/2 text-left">{white}</span>
              <span className="w-1/2 text-left ml-4">{black}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};
