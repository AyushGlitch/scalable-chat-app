import ChatWindow from "@/components/dashboard/ChatWindow"
import FriendsList from "@/components/dashboard/FriendsList"
import { useSocket } from "@/hooks/useSocket"
import { useUserStore } from "@/store/userStore"
import { useState } from "react"


type selectedFriendType= {
    username: string,
    email: string,
    userId: string
}


export default function Dashboard() {
    const socket= useSocket()
    const user= useUserStore( (state) => state.user )
    const [selectedFriend, setSelectedFriend]= useState<selectedFriendType>({
        username: '',
        email: '',
        userId: ''
    })


    const handleSelectFriend= (friend: {username: string, email: string, userId: string}) => {
        setSelectedFriend(friend)
    }

    return (
        <div className="flex w-full h-full max-h-screen overflow-hidden">
            <FriendsList user={user} type={"dashboard"} handleSelectFriend={handleSelectFriend} />
            <ChatWindow selected= {selectedFriend}  />
        </div>
    )
}