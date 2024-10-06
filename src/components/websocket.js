import React, { useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"

const WebSocket = () => {
    const WS_URL = "wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        WS_URL,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )
    // Run when the connection state (readyState) changes
    useEffect(() => {
        console.log("Connection state changed")
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
                event: "bts:subscribe",
                data: {
                   "channel": "[live_trades_[currency_pair]]"
                },
            })
        }
    }, [readyState])
    useEffect(() => {
        console.log(lastJsonMessage)
      }, [lastJsonMessage])


    return (
        <div>{'lastJsonMessage'}</div>
    )
}

export default WebSocket