import { memo, useEffect } from "react"
import ChatWindowBody from "./ChatWindowBody"
import ChatWindowInput from "./ChatWindowInput"
import { useUserStore } from "@/store/userStore"


type UserType= {
    username: string,
    email: string,
    userId: string,
}

type RoomType= {
    roomName: string,
    roomId: string
}


type ChatWindowPropsType= {
    selected: UserType | RoomType,
    socket: WebSocket | null
}


function ChatWindow({selected, socket}: ChatWindowPropsType) {
    const setPerChatMessages= useUserStore(  (state) => state.setPerChatMessages)

    useEffect( () => {
        if (!socket) {
            return
        }

        socket.onmessage = function (event) {
            const data= JSON.parse(event.data)

            switch (data.type) {
                case 'personalMessage':
                    const newMessage= {
                        from: data.from,
                        message: data.message,
                        time: data.time
                    }
                    if ('userId' in selected) {
                        setPerChatMessages(newMessage, data.from)
                    }
                    console.log(`From: ${data.from}`)
                    console.log(`Message: ${data.message}`)
                    console.log(`Time: ${data.time}`)
                    break

                case 'roomMessage':
                    console.log(`Message: ${data.message}`)
                    break
            }
        }
    }, [socket] )

    return (
        <div className=" w-4/6">
            <div className="bg-slate-800 text-white rounded-3xl w-full h-[10%] flex px-5 justify-between items-center text-2xl font-semibold mx-2 my-1">
                {'username' in selected ? (
                    <>
                        <h1>{selected.username}</h1>
                        <h1>{selected.email}</h1>
                    </>
                ) : (
                    <h1>{selected.roomName}</h1>
                )}
            </div>

            <ChatWindowBody selected= {selected} />

            <ChatWindowInput socket={socket} selected= {selected} />
        </div>
    )
}

export default memo(ChatWindow)