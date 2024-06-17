import FriendsList from "@/components/dashboard/FriendsList";
import AlreadyFriends from "@/components/friends/AlreadyFriends";
import RequestList from "@/components/friends/RequestList";
import { useUserStore } from "@/store/userStore";



export default function Friends() {
    const user= useUserStore( (state) => state.user )

    return (
        <div className="grid grid-cols-3 gap-3">
            <FriendsList user={user} />
            <AlreadyFriends/>
            <RequestList/>
        </div>
    )
}