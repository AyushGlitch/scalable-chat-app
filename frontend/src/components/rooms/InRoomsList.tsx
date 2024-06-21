import { memo, useState } from "react"
import { Button } from "../ui/button"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createRoom, getJoinedRooms } from "@/api/apis"
import { LoaderCircle } from "lucide-react"
import RoomCard from "./RoomCard"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"




const InRoomsList= () => {
    const [roomName, setRoomName] = useState<string>("")
    console.log("Room Name: ", roomName)

    const joinedRoomsQuery= useQuery({
        queryKey: ['joinedRooms'],
        queryFn: () => getJoinedRooms()
    })
    

    const createRoomQuery= useMutation({
        mutationFn: () => createRoom({roomName}),
        onSettled: (_, error) => {
            if (!error) {
                toast.success("Room created successfully")
                joinedRoomsQuery.refetch()
            }
            else if (error) {
                toast.error("Error creating room")
                console.log("Error: ", error)
            }
        }
    })


    if (joinedRoomsQuery.isFetching) {
        return (
            <div className="flex w-full justify-center items-center">
                <LoaderCircle size={50} className="animate-spin" />
            </div>
        )
    }


    const handleCreateRoom= () => {
        if (roomName === "") {
            toast.error("Room name cannot be empty")
            return
        }

        createRoomQuery.mutate()
    }


    return (
        <div className="bg-red-400 rounded-3xl p-3 flex flex-col justify-center items-center gap-5">
            <h1 className="text-2xl font-semibold underline">Rooms Joined</h1>

            <Dialog>
                <DialogTrigger className="w-3/5" asChild>
                    <Button variant={"secondary"} size={"lg"} className="bg-emerald-500 text-lg w-3/5 font-semibold">
                        Create Room
                    </Button>
                </DialogTrigger>

                <DialogContent className="bg-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Create Room</DialogTitle>
                        <DialogDescription>Fill the below details to create a room.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-base">
                            Room Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter Room Name"
                            className="col-span-3 bg-slate-900"
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant={"secondary"} size={"lg"} className="bg-emerald-500 text-lg font-semibold" onClick={handleCreateRoom}>
                            Create Room
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-5 w-full">
                {
                    joinedRoomsQuery.data.length== 0 ? (
                        <div className="text-xl font-bold">
                            No rooms joined
                        </div>
                    ) : (
                        joinedRoomsQuery.data.map( (room: {roomId: string, roomName: string, isAdmin: boolean}) => (
                            <RoomCard key={room.roomId} roomId={room.roomId} roomName={room.roomName} isAdmin={room.isAdmin} type="InRoomsList" />
                        ) )
                    ) 
                }
            </div>
        </div>
    )
}


export default memo(InRoomsList)