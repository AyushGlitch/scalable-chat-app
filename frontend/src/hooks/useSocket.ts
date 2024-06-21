import { useUserStore } from "@/store/userStore"
import { useEffect, useState } from "react"



export const useSocket= () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const user= useUserStore( (state) => state.user )

    // console.log(socket, "       ", user.userId)
    useEffect( () => {
        if (!user) {
            return
        }

        const ws= new WebSocket(`ws://localhost:8080?userId=${user.userId}`)

        ws.onopen= () => {
            console.log("Connected")
            setSocket(ws)
        }

        ws.onclose= () => {
            console.log("Disconnected")
            setSocket(null)
        }

        return () => {
            ws.close()
        }
    }, [user] )

    return socket
}