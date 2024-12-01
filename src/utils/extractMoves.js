export const extractMoves = (pgnString) => {
    const moves = [];
    const lines = pgnString.trim().split("\n");
    const splitMoves = lines[lines.length - 1].split(" ");
    for(let i = 1; i < splitMoves.length; i+=8) {
      moves.push(splitMoves[i]);
    }
  
    return moves
}