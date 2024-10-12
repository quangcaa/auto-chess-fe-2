import { useEffect, useState } from "react"
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = 'init_game'
export const MOVE = 'move'
export const GAME_OVER = 'game_over'

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
                setChess(new Chess())
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
