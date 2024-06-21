import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getAlreadyFriends, getRoomInfo, sendJoinRoomRequest } from "@/api/apis";
import { useState } from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { toast } from "sonner";


type EditDialogProps = {
    roomId: string,
    roomName: string
}


export default function EditDialog( {roomId, roomName}: EditDialogProps ) {
    const [roomN, setRoomN] = useState<string>(roomName)

    const getRoomInfoQuery = useQuery({
        queryKey: ['roomInfo', roomId],
        queryFn: () => getRoomInfo({ roomId })
    })

    const getAlreadyFriendsQuery = useQuery({
        queryKey: ['getAlreadyFriends'],
        queryFn: () => getAlreadyFriends()
    })

    const sendJoinRoomRequestQuery = useMutation({
        mutationFn: (friendId: string) => sendJoinRoomRequest({ roomId, friendId}),
        onSettled: (_, error) => {
            if (!error) {
                toast.success("Join room request sent")
            }
            else {
                toast.error("Error sending join room request")
            }
        }
    })


    function handleRoomRequest(friendId: string) {
        sendJoinRoomRequestQuery.mutate(friendId)
    }


    return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"secondary"} size={"lg"} className="bg-emerald-500 w-full text-slate-700 font-semibold">
                        Edit Room
                    </Button>
                </DialogTrigger>

                <DialogContent className="bg-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Room</DialogTitle>
                        <DialogDescription>Change the below details to edit the room.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-base">
                            Room Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue={roomN}
                            className="col-span-3 bg-slate-900"
                            onChange={(e) => setRoomN(e.target.value)}
                        />

                        <Label htmlFor="members" className="text-right text-base">
                            Members
                        </Label>
                        <Command className="w-11/12 mx-auto bg-slate-400 text-zinc-900 col-span-3">
                            <CommandInput placeholder="Search" className="text-base h-14" />
                            <CommandList>
                                <CommandEmpty className="text-base w-full text-center p-5">No Results</CommandEmpty>
                                {
                                    getRoomInfoQuery.data && getRoomInfoQuery.data.map( (friend: { email: string, username: string, userId: string }, i: number) => (
                                        <CommandItem key={i} >
                                            <div className=" flex w-full justify-between mx-3">
                                                <h1>{friend.username}</h1>
                                                <Button variant={'destructive'} size={"sm"}>
                                                    Remove
                                                </Button>
                                            </div>
                                            <h1>{friend.email}</h1>
                                        </CommandItem>
                                    ) )
                                }
                            </CommandList>
                        </Command>

                        <Label htmlFor="members" className="text-right text-base">
                            Add Members
                        </Label>
                        <Command className="w-11/12 mx-auto bg-slate-400 text-zinc-900 col-span-3">
                            <CommandInput placeholder="Search" className="text-base h-14" />
                            <CommandList>
                                <CommandEmpty className="text-base w-full text-center p-5">No Results</CommandEmpty>
                                {
                                    getAlreadyFriendsQuery.data && getAlreadyFriendsQuery.data.map( (friend: { email: string, username: string, userId: string }, i: number) => (
                                        <CommandItem key={i} >
                                            <div className="flex justify-between px-1 w-full">
                                                <div className="flex flex-col gap-2">
                                                    <h1><span className="font-bold">Name: </span>{friend.username}</h1>
                                                    <h1><span className="font-bold">Email: </span>{friend.email}</h1>
                                                </div>
                                                <Button variant={"secondary"} size={"sm"} className="bg-emerald-500 my-auto" onClick={() => handleRoomRequest(friend.userId)}>
                                                    Add
                                                </Button>
                                            </div>
                                        </CommandItem>
                                    ) )
                                }
                            </CommandList>
                        </Command>
                    </div>

                    {/* <DialogFooter>
                        <Button variant={"secondary"} size={"lg"} className="bg-emerald-500 text-lg font-semibold">
                            Create Room
                        </Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>
    )
}