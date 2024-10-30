import { useCallback, useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
    const [lastError, setLastError] = useState<string | null>(null)

    const connect = useCallback(() => {
        try {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                throw new Error('No access token found')
            }

            const ws = new WebSocket(`ws://localhost:8080?token=${accessToken}`)

            ws.onopen = () => {
                console.log('[WebSocket] Connection established')
                setConnectionStatus('connected')
                setSocket(ws)

                // send a ping to test the connection
                ws.send(JSON.stringify({ type: 'PING' }))
            }

            ws.onclose = (event) => {
                console.log('[WebSocket] Connection closed:', event)
                setConnectionStatus('disconnected')
                setSocket(null)

                // Attempt to reconnect after 5 seconds
                setTimeout(connect, 5000)
            }

            ws.onerror = (error) => {
                console.error('[WebSocket] Error:', error)
                setLastError(error.toString())
            }

        } catch (error) {
            console.error('[WebSocket] Setup error:', error)
            setLastError(error instanceof Error ? error.message : 'Unknown error')
        }
    }, [])

    useEffect(() => {
        connect()

        return () => {
            if (socket) {
                console.log('[Websocket] Cleaning up connection')
                socket.close()
            }
        }
    }, [connect])

    return { socket, connectionStatus, lastError }
}