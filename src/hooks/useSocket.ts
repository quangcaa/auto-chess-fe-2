import { useEffect, useState } from "react"

const accessToken = localStorage.getItem('accessToken')
const WS_URL = `ws://localhost:8080?token=${accessToken}`

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(WS_URL)
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