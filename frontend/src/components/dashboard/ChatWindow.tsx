import { memo } from "react"
import ChatWindowBody from "./ChatWindowBody"
import ChatWindowInput from "./ChatWindowInput"



type ChatWindowPropsType= {
    selected: {
        username: string,
        email: string,
        userId: string
    }
}


function ChatWindow({selected}: ChatWindowPropsType) {
    return (
        <div className="bg-emerald-500 w-4/6">
            <div className="bg-blue-400 w-full h-[10%] flex px-5 justify-between items-center text-2xl font-semibold">
                <h1>{selected.username}</h1>
                <h1>{selected.email}</h1>
            </div>

            <ChatWindowBody />

            <ChatWindowInput />
        </div>
    )
}

export default memo(ChatWindow)