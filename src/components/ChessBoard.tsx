import { useEffect, useState } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"

import { GAME_OVER, INIT_GAME, MOVE } from "../constants"

export const ChessBoard = ({ socket }: { socket: WebSocket }) => {
    const [game, setGame] = useState(new Chess())
    const [fen, setFen] = useState(game.fen())

    console.log(`[CHESSBOARD] : ${socket}`)

    // useEffect(() => {
    //     if (!socket) return

    //     socket.onmessage = (event) => {
    //         const message = JSON.parse(event.data)

    //         if (message.type === INIT_GAME) {
    //             const newGame = new Chess()
    //             setGame(newGame)
    //             setFen(newGame.fen())
    //         } else if (message.type === MOVE) {
    //             console.log('MOVE IN CHESSBOARD')
    //             const move = message.payload
    //             game.move(move)
    //             setFen(game.fen())
    //         } else if (message.type === GAME_OVER) {
    //             console.log("Game over")
    //         }
    //     }
    // }, [socket, game])

    const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece[1]?.toLowerCase() ?? "q", 
        })

        if (move === null) return false

        setFen(game.fen())
        // socket.send(JSON.stringify({
        //     type: MOVE, 
        //     payload: {
        //         move
        //     }
        // }))

        const message = { type: MOVE, payload: move }
        socket.send(JSON.stringify(message))

        console.log('SENT FROM ON DROP ?')
        return true
    }

    return (
        <div>
            <Chessboard position={fen} onPieceDrop={onDrop} />
        </div>
    )
}

// import { Chess, Square, Color, PieceSymbol } from 'chess.js'
// import { Chessboard } from "react-chessboard"
// import React, { MouseEvent, memo, useEffect, useState } from 'react'
// import { useRecoilState } from 'recoil'

// // phong tot
// export function isPromoting(chess: Chess, from: Square, to: Square) {
//     if (!from) {
//         return false
//     }

//     const piece = chess.get(from)

//     if (piece?.type !== 'p') {
//         return false
//     }

//     if (piece.color !== chess.turn()) {
//         return false
//     }

//     if (!['1', '8'].some((it) => to.endsWith(it))) {
//         return false
//     }

//     return chess
//         .history({ verbose: true })
//         .map((it) => it.to)
//         .includes(to)
// }


// export const ChessBoard = memo(
//     ({
//         game_id,
//         started,
//         myColor,
//         chess,
//         board,
//         socket,
//         setBoard,
//     }: {
//         myColor: Color
//         game_id: string
//         started: boolean,
//         chess: Chess,
//         setBoard: React.Dispatch<
//             React.SetStateAction<
//                 ({
//                     square: Square
//                     type: PieceSymbol,
//                     color: Color
//                 } | null)[][]
//             >
//         >
//         board: ({
//             square: Square
//             type: PieceSymbol
//             color: Color
//         } | null)[][]
//         socket: WebSocket
//     }) => {
//         console.log('chessboard reloaded')

//         const isMyTurn = myColor === chess.turn()

//         const handleMouseDown = (e: MouseEvent<HTMLDivElement>, squareRep: string) => {
//             e.preventDefault()
//             if (e.button === 2) {
               
//             }
//         };

//         useEffect(() => {
//         }, [game_id, started, myColor, chess, board, socket, setBoard])

//         return (
//             <div>
//                 <Chessboard position={chess.fen()} />
//             </div>
//         )
//     }
// )