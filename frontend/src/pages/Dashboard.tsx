import ChatWindow from "@/components/dashboard/ChatWindow"
import FriendsList from "@/components/dashboard/FriendsList"
import { useUserStore } from "@/store/userStore"



export default function Dashboard() {
    const user= useUserStore( (state) => state.user )

    return (
        <div className="flex w-full">
            <FriendsList user={user} />
            <ChatWindow />
        </div>
    )
}