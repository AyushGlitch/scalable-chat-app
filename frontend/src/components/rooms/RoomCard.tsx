import { memo } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import EditDialog from "./EditDialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { acceptRoomRequest, declineRoomRequest, leaveRoom } from "@/api/apis"
import { toast } from "sonner"

type RoomCardProps = {
    roomId: string,
    roomName: string,
    isAdmin?: boolean,
    type: string,
    userId?: string,
    username?: string,
    email?: string
}

const RoomCard = ({ roomId, roomName, isAdmin, type, userId, username, email }: RoomCardProps) => {
    const queryClient= useQueryClient()


    const acceptRoomRequestQuery= useMutation({
        mutationFn: () => acceptRoomRequest({senderId: userId!, roomId: roomId}),
        onSettled: (_, error) => {
            if (!error) {
                toast.success('Room request accepted successfully')
                queryClient.invalidateQueries({ queryKey: ['joinedRooms'] })
                queryClient.invalidateQueries({ queryKey: ['roomRequests'] })
            }
            else {
                toast.error('Error accepting room request')
                console.log("Error: ", error)
            }
        }
    })


    const leaveRoomQuery= useMutation({
        mutationFn: () => leaveRoom({roomId: roomId, isAdmin: isAdmin!}),
        onSettled: (_, error) => {
            if (!error) {
                toast.success('Room left successfully')
                queryClient.invalidateQueries({ queryKey: ['joinedRooms'] })
            }
            else {
                toast.error('Error leaving room')
                console.log("Error: ", error)
            }
        }
    })


    const declineRoomRequestQuery= useMutation({
        mutationFn: () => declineRoomRequest({senderId: userId!, roomId: roomId}),
        onSettled: (_, error) => {
            if (!error) {
                toast.success('Room request declined successfully')
                queryClient.invalidateQueries({ queryKey: ['roomRequests'] })
            }
            else {
                toast.error('Error declining room request')
                console.log("Error: ", error)
            }
        }
    })
    

    function handleAcceptRoomRequest () {
        acceptRoomRequestQuery.mutate()
    }


    function handleLeaveRoom () {
        leaveRoomQuery.mutate()
    }


    function handleDeclineRoomRequest () {
        declineRoomRequestQuery.mutate()
    }



    return (
        <div className="flex justify-evenly items-center w-full">
            <Card className="w-5/6 p-3">
                <div className="flex justify-between">
                    
                        {
                            type === 'InRoomsList' ? (
                                <div>
                                    <p><span className="font-medium">Room Name:</span> {roomName}</p>
                                </div>
                            ) : (
                                <div>
                                    <p><span className="font-medium">Room Name:</span> {roomName}</p>
                                    <p><span className="font-medium">Send By:</span> {username}</p>
                                    <p><span className="font-medium">Sender Email:</span> {email}</p>
                                </div>
                            )
                        }
                    

                    <div className="my-auto">
                        {
                            type === 'InRoomsList' ? (
                                <div className="flex flex-col gap-5 justify-center">
                                    {isAdmin && (<EditDialog roomId={roomId} roomName={roomName}  />)}
                                    <Button variant={'destructive'} size={"default"} onClick={handleLeaveRoom}>
                                        Leave
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5 justify-center">
                                    <Button variant={'secondary'} size={"default"} className="bg-emerald-500" onClick={handleAcceptRoomRequest}>
                                        Accept
                                    </Button>
                                    <Button variant={'destructive'} size={'default'} onClick={handleDeclineRoomRequest}>
                                        Decline
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Card>

        </div>
    )
}

export default memo(RoomCard)
