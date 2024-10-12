import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

import { MOVE } from "../constants";

export const ChessBoard = ({ socket }: { socket: WebSocket }) => {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "init_game") {
                const newGame = new Chess();
                setGame(newGame);
                setFen(newGame.fen());
            } else if (message.type === "move") {
                const move = message.payload;
                game.move(move);
                setFen(game.fen());
            } else if (message.type === "game_over") {
                console.log("Game over");
            }
        };
    }, [socket, game]);

    const onDrop = (sourceSquare: string, targetSquare: string) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for simplicity
        });

        if (move === null) return;

        setFen(game.fen());
        socket.send(JSON.stringify({ type: MOVE, payload: { move } }));
        return true;
    };

    return (
        <div>
            <Chessboard position={fen} onPieceDrop={onDrop} />
        </div>
    );
};