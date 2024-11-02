import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:3333" : "/"

let socket = null

export const initSocket = (user_id) => {
    if (socket) {
        socket.disconnect()
    }

    socket = io(SOCKET_URL, {
        auth: {
            user_id: user_id
        }
    })

    console.log('SOCKET.FE.js')
    console.log(socket)

    return socket
}

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized')
    }

    return socket
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}