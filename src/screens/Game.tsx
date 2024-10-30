import { useCallback, useEffect, useState, useRef } from "react"
import { Chess } from "chess.js"

import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"

import { useSocket } from "../hooks/useSocket"

import { GAME_OVER, INIT_GAME, MOVE, GAME_ADDED } from "../constants"
import { useNavigate, useParams } from "react-router-dom"

export const Game = () => {
    const { socket, connectionStatus, lastError } = useSocket()
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board())
    const [added, setAdded] = useState(false)
    const [gameID, setGameID] = useState("")
    const [started, setStarted] = useState(false)
    const navigate = useNavigate()

    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            console.log('[WebSocket] Raw message received:', event.data)

            const message = JSON.parse(event.data)
            console.log('[WebSocket] Parsed message:', message)

            switch (message.type) {
                case GAME_ADDED:
                    console.log("[Game] Game added", message)
                    setAdded(true)
                    setGameID(message.game_id || '')
                    break

                case INIT_GAME:
                    console.log("[Game] Game initialized", message)
                    setBoard(chess.board())
                    setStarted(true)
                    if (message.payload?.game_id) {
                        navigate(`/game/${message.payload.game_id}`)
                    }
                    break

                case MOVE:
                    console.log("[Game] Move received", message)
                    if (message.payload?.move) {
                        chess.move(message.payload.move)
                        setBoard(chess.board())
                    }
                    break

                case GAME_OVER:
                    console.log("[Game] Game over", message)
                    break

                default:
                    console.log("[Game] Unknown message type:", message.type)
            }
        } catch (error) {
            console.error('[Game] Error handling message:', error)
        }
    }, [chess, navigate])

    useEffect(() => {
        if (!socket) {
            console.log('[Game] No socket connection available')
            return
        }

        console.log('[Game] Setting up message handler')
        socket.addEventListener('message', handleMessage)

        return () => {
            console.log('[Game] Cleaning up message handler')
            socket.removeEventListener('message', handleMessage)
        }
    }, [socket, handleMessage])

    if (connectionStatus === 'connecting') {
        return <div>Connecting to game server...</div>
    }


    if (connectionStatus === 'disconnected') {
        return (
            <div>
                <div>Connection lost. Attempting to reconnect...</div>
                {lastError && <div>Error: {lastError}</div>}
            </div>
        )
    }

    // if (!socket) return <div>Connecting...</div>

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-1 gap4 md:grid-cols-3">
                    <div>
                        {lastError && <div className="text-red-500">Error: {lastError}</div>}
                    </div>
                    <div>
                        <ChessBoard socket={socket} />
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                if (socket) {
                                    const message = { type: INIT_GAME };
                                    console.log('[Game] Sending init game message:', message);
                                    socket.send(JSON.stringify(message));
                                }
                            }}
                        >
                            CREATE A GAME
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};