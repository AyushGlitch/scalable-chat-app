import { getSavedMessages } from "@/api/apis"
import ChatWindow from "@/components/dashboard/ChatWindow"
import FriendsList from "@/components/dashboard/FriendsList"
import { useSocket } from "@/hooks/useSocket"
import { useUserStore } from "@/store/userStore"
import { useQuery } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
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


type Message = {
    from: string,
    message: string,
    time: string,
}

type RoomMessage = {
    from: string,
    message: string,
    time: string,
}


export default function Dashboard() {
    const socket= useSocket()
    const user= useUserStore( (state) => state.user )
    const setSavedPerChats= useUserStore( (state) => state.setSavedPerChats )
    const setSavedRoomChats= useUserStore( (state) => state.setSavedRoomChats )
    const [selected, setSelected] = useState<SelectedType | null>(null)
    console.log(selected)


    const savedMessagesQuery= useQuery({
        queryKey: ['getSavedMessages'],
        queryFn: () => getSavedMessages(),
        staleTime: Infinity
    })


    if (savedMessagesQuery.isFetching) {
        return(
            <div className="flex w-full justify-center items-center">
                <LoaderCircle size={50} className="animate-spin" />
            </div>
        )
    }


    if (savedMessagesQuery.data) {
        const savedPerMessages= savedMessagesQuery.data.finalSavedPerMessages
        savedPerMessages.forEach( (perMessage: {friendId:string, messages: Message[]}) => {
            setSavedPerChats(perMessage.messages, perMessage.friendId)
            // console.log(perMessage.messages, perMessage.friendId)
        } )

        const savedRoomMessages= savedMessagesQuery.data.finalSavedRoomMessages
        savedRoomMessages.forEach( (roomMessage: {roomId:string, messages: RoomMessage[]}) => {
            setSavedRoomChats(roomMessage.messages, roomMessage.roomId)
        } )
        console.log( user)
    }

    
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