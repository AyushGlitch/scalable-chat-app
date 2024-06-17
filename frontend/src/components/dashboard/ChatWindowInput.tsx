import { memo, useState } from "react";
import { Textarea } from "../ui/textarea";



function ChatWindowInput () {
    const [message, setMessage]= useState('')
    console.log(message)

    return (
        <div className="bg-purple-400 w-full px-5 py-3">
            <Textarea className="text-lg font-normal h-20" placeholder="Type your message..." onChange={(e) => setMessage(e.target.value)} />
        </div>
    )
}


export default memo(ChatWindowInput)