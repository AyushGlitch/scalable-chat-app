import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getAlreadyFriends, getRoomInfo, removeMember, roomNameChange, sendJoinRoomRequest } from "@/api/apis";
import { useState } from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { toast } from "sonner";


type EditDialogProps = {
    roomId: string,
    roomName: string
}


export default function EditDialog( {roomId, roomName}: EditDialogProps ) {
    const [roomN, setRoomN] = useState<string>(roomName)
    const queryClient= useQueryClient()

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


    const removeMemberQuery= useMutation({
        mutationFn: (friendId: string) => removeMember({roomId, friendId}),
        onSettled: (_, error) => {
            if (!error) {
                toast.success("Member removed successfully")
                queryClient.invalidateQueries({ queryKey: ['roomInfo', roomId] })
                queryClient.invalidateQueries({ queryKey: ['getAlreadyFriends'] })
            }
            else {
                toast.error("Error removing member")
            }
        }
    })


    const handleRoomNameChangeQuery= useMutation({
        mutationFn: () => roomNameChange({roomId, roomName: roomN}),
        onSettled: (_, error) => {
            if (!error) {
                toast.success("Room name changed successfully")
                queryClient.invalidateQueries({ queryKey: ['joinedRooms'] })
            }
            else {
                toast.error("Error changing room name")
            }
        }
    })


    function handleRoomRequest(friendId: string) {
        sendJoinRoomRequestQuery.mutate(friendId)
    }


    function handleRemoveMember(friendId: string) {
        removeMemberQuery.mutate(friendId)
    }

    function handleRoomNameChange() {
        handleRoomNameChangeQuery.mutate()
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
                            className="col-span-2 bg-slate-900"
                            onChange={(e) => setRoomN(e.target.value)}
                        />
                        <Button variant={"outline"} size={"sm"} className="bg-blue-400 mx-3" onClick={handleRoomNameChange}>
                            Save
                        </Button>

                        <Label htmlFor="members" className="text-right text-base">
                            Members
                        </Label>
                        <Command className="w-11/12 mx-auto bg-slate-400 text-zinc-900 col-span-3">
                            <CommandInput placeholder="Search" className="text-base h-14" />
                            <CommandList>
                                <CommandEmpty className="text-base w-full text-center p-5">No Results</CommandEmpty>
                                {
                                    getRoomInfoQuery.data && getRoomInfoQuery.data.map((friend: { email: string, username: string, userId: string }, i: number) => (
                                        <CommandItem key={i}>
                                            <div className="flex justify-between px-1 w-full">
                                                <div className="flex flex-col gap-2">
                                                    <h1><span className="font-bold">Name: </span>{friend.username}</h1>
                                                    <h1><span className="font-bold">Email: </span>{friend.email}</h1>
                                                </div>
                                                <Button variant={"destructive"} size={"sm"} onClick={() => handleRemoveMember(friend.userId)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </CommandItem>
                                    ))
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
                                    getAlreadyFriendsQuery.data && getRoomInfoQuery.data && getAlreadyFriendsQuery.data
                                        .filter((friend: { userId: string }) => !getRoomInfoQuery.data.some((roomFriend: { userId: string }) => roomFriend.userId === friend.userId))
                                        .map((friend: { email: string, username: string, userId: string }, i: number) => (
                                            <CommandItem key={i}>
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
                                        ))
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