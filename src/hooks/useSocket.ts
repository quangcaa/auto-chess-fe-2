import { useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')

        const ws = new WebSocket(`ws://localhost:8080?token=${accessToken}`)
        ws.onopen = () => {
            setSocket(ws)
        }

        ws.onclose = () => {
            setSocket(null)
        }

        return () => {
            ws.close()
        }
    }, [])

    return socket
}