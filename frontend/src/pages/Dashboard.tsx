import ChatWindow from "@/components/dashboard/ChatWindow"
import FriendsList from "@/components/dashboard/FriendsList"
import { useSocket } from "@/hooks/useSocket"
import { useUserStore } from "@/store/userStore"
import { useState } from "react"


type SelectedFriendType = {
    username: string,
    email: string,
    userId: string
}

type SelectedRoomType = {
    roomName: string,
    roomId: string,
    isAdmin: boolean
}

type SelectedType = SelectedFriendType | SelectedRoomType


export default function Dashboard() {
    const socket= useSocket()
    const user= useUserStore( (state) => state.user )
    const [selected, setSelected] = useState<SelectedType | null>(null)
    console.log(selected)

    
    const handleSelectFriend = (selection: SelectedType) => {
        setSelected(selection)
    }

    return (
        <div className="flex w-full h-full max-h-screen overflow-hidden">
            <FriendsList user={user} type={"dashboard"} handleSelectFriend={handleSelectFriend} />
            {
                selected && (
                    <ChatWindow selected= {selected} socket={socket} />
                )
            }
        </div>
    )
}