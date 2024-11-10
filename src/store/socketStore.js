import { create } from 'zustand'
import { io } from 'socket.io-client'

const useSocketStore = create((set) => ({
    socket: null,
    connect: (user_id) => {
        const socket = io('http://localhost:3333', {
            auth: {
                user_id
            }
        })

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id)
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected')
        })

        set({ socket })
    },
    disconnect: () => {
        set((state) => {
            state.socket?.disconnect()
            return { socket: null }
        })
    }
}))

export default useSocketStore
