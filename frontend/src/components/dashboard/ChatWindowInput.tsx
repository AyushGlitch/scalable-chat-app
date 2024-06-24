import { memo, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/userStore";

type UserType= {
    username: string,
    email: string,
    userId: string,
}

type RoomType= {
    roomName: string,
    roomId: string,
    isAdmin: boolean
}

type ChatWindowInputPropsType= {
    socket: WebSocket | null
    selected: UserType | RoomType
}


function ChatWindowInput ({socket, selected}: ChatWindowInputPropsType) {
    const user= useUserStore( (state) => state.user )
    const [message, setMessage]= useState('')
    const textAreaRef= useRef<HTMLTextAreaElement>(null)
    // console.log(message)
    let setChatMessages: any;
    if ('userId' in selected) {
        setChatMessages= useUserStore( (state) => state.setPerChatMessages )
    }
    else if ('roomId' in selected) {
        setChatMessages= useUserStore( (state) => state.setRoomChatMessage )
    }

    function handleClick() {
        if (!socket) {
            return 
        }

        const date= new Date()
        const time= date.toLocaleTimeString()
        const dateStr= date.toLocaleDateString()

        if ('username' in selected) {
            const mess= JSON.stringify({
                type: 'personalMessage',
                to: selected.userId,
                message: message,
                time: time+" "+dateStr
            })
            socket.send(mess)
            
            const newMessage= {
                from: user.userId,
                message: message,
                time: time+" "+dateStr
            }
            setChatMessages(newMessage, selected.userId)
            console.log("Message sent: ", newMessage)
        }
        else if ('roomId' in selected) {
            socket.send(JSON.stringify({
                type: 'roomMessage',
                roomId: selected.roomId,
                message: message,
                time: time+" "+dateStr
            }))

            const newMessage= {
                from: user.userId,
                roomId: selected.roomId,
                message: message,
                time: time+" "+dateStr
            }
            setChatMessages(newMessage, selected.roomId)
            console.log("Message sent: ", newMessage)
        }

        setMessage('')
        if (textAreaRef.current) {
            textAreaRef.current.value= ''
        }
    }

    return (
        <div className="bg-slate-800 rounded-3xl mx-2 my-1 w-full px-5 py-3 flex gap-3">
            <Textarea ref={textAreaRef} className="text-lg font-normal h-20" placeholder="Type your message..." onChange={(e) => setMessage(e.target.value)} />
            <Button variant={'default'} size={"lg"} className="my-auto" onClick={handleClick}>
                Send
            </Button>
        </div>
    )
}


export default memo(ChatWindowInput)