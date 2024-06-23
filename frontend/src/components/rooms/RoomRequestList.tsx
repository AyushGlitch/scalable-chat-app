import { getRoomRequests } from "@/api/apis"
import { useQuery } from "@tanstack/react-query"
import { memo } from "react"
import RoomCard from "./RoomCard"



const RoomRequestList= () => {

    const getRoomRequestsQuery= useQuery({
        queryKey: ['roomRequests'],
        queryFn: () => getRoomRequests()
    })


    return (
        <div className="bg-orange-400 rounded-3xl p-3 flex flex-col items-center gap-5">
            <h1 className="text-2xl font-semibold underline">Room Request List</h1>

            <div className="flex flex-col gap-5 w-full">
                {
                    getRoomRequestsQuery.isFetched && getRoomRequestsQuery.data.length== 0 ? (
                        <div className="text-xl font-bold text-center">
                            No rooms requests
                        </div>
                    ) : (
                        getRoomRequestsQuery.isFetched && getRoomRequestsQuery.data.map( (room: {roomId: string, roomName: string, userId: string, username: string, email:string}) => (
                            <RoomCard key={room.roomId} roomId={room.roomId} roomName={room.roomName} userId={room.userId} username={room.username} email={room.email} type="RoomRequests" />
                        ) )
                    ) 
                }
            </div>
        </div>
    )
}


export default memo(RoomRequestList)