import { getJoinedRooms } from "@/api/apis"
import { useUserStore } from "@/store/userStore"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const user = useUserStore((state) => state.user)
    
    const { data: joinedRoomsData, isFetched } = useQuery({
        queryKey: ['joinedRooms'],
        queryFn: getJoinedRooms,
        enabled: !!user // Ensure the query only runs if the user is available
    })

    const joinedRooms = isFetched ? joinedRoomsData.map((room: any) => room.roomId) : []

    useEffect(() => {
        if (!user || !user.userId) {
            return
        }

        const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?userId=${user.userId}`)

        ws.onopen = () => {
            console.log("Connected")
            setSocket(ws)

            ws.send(JSON.stringify({
                type: 'joinRooms',
                rooms: joinedRooms
            }))
        }

        ws.onclose = () => {
            console.log("Disconnected")
            setSocket(null)
        }

        return () => {
            ws.close()
        }
    }, [user, joinedRoomsData])

    return socket
}
