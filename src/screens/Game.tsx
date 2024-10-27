import { useEffect, useState } from "react";
import { Chess } from "chess.js";

import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";

import { useSocket } from "../hooks/useSocket";

import { GAME_OVER, INIT_GAME, MOVE } from "../constants";

export const Game = () => {
    const socket = useSocket()
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board())

    useEffect(() => {
        if (!socket) {
            return
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)

            if (message.type === INIT_GAME) {
                console.log("Game initialized")
            } else if (message.type === MOVE) {
                const move = message.payload
                chess.move(move)
                setBoard(chess.board())
                console.log("Move made")
            } else if (message.type === GAME_OVER) {
                console.log("Game over")
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-1 gap4 md:grid-cols-3">
                    <div></div>
                    <div>
                        <ChessBoard socket={socket} />
                    </div>
                    <div>
                        <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME,
                            }))
                        }}>
                            CREATE A GAME
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
};