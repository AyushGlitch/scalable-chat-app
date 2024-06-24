import { getRoomInfo } from "@/api/apis"
import { useUserStore } from "@/store/userStore"
import { useQuery } from "@tanstack/react-query"
import { memo, useMemo } from "react"


type UserType= {
    username: string,
    email: string,
    userId: string,
}

type RoomType= {
    roomName: string,
    roomId: string
    isAdmin: boolean
}

type ChatWindowBodyPropsType= {
    selected: UserType | RoomType
}


function ChatWindowBody ({selected}: ChatWindowBodyPropsType) {
    const user= useUserStore( (state) => state.user )
    
    const { data: roomInfo } = useQuery({
        // @ts-ignore
        queryKey: ['getRoomInfo', selected.roomId],
        // @ts-ignore
        queryFn: () => getRoomInfo({ roomId: selected.roomId }),
        enabled: 'roomId' in selected // Only run the query if `roomId` is in `selected`
    })

    let realTimeMessages: any[]= []

    if ('userId' in selected) {
        realTimeMessages= useUserStore ( (state) => state.perChatMessages[selected.userId] ) || []
    }
    else {
        realTimeMessages= useUserStore ( (state) => state.roomChatMessage[selected.roomId] ) || []
    }


    // Create a map of userId to username from roomInfo
    const userIdToUsernameMap = useMemo(() => {
        if (roomInfo) {
            const map = {}
            roomInfo.forEach((member: UserType) => {
                // @ts-ignore
                map[member.userId] = member.username
            })
            // @ts-ignore
            map[user.userId]= "You"
            return map
        }
        return {}
    }, [roomInfo])

    console.log(realTimeMessages)


    return (
        <div className="bg-slate-800 mx-2 my-1 p-2 rounded-3xl h-[76%] w-full overflow-auto flex flex-col-reverse">
            {
                selected && realTimeMessages.length> 0 && realTimeMessages.map( (message, index) => {
                    // @ts-ignore
                    const senderName = userIdToUsernameMap[message.from] || 'Unknown'
                    return (
                        <div key={index} className={`flex ${user.userId == message.from ? 'justify-end' : 'justify-start'} w-full my-2`}>
                            <div className={`border-2 rounded-3xl border-white px-5 py-3 max-w-2/3 ${user.userId == message.from ? 'bg-emerald-400 text-right' : 'bg-slate-600 text-left'}`}>
                                {'roomId' in selected && <p className="text-sm font-bold text-left">{senderName}</p>} {/* Display sender's name for room chats only */}
                                <p className="text-lg font-normal">{message.message}</p>
                                <p className="text-sm font-light">{message.time}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default memo(ChatWindowBody)