import { useQuery } from "@tanstack/react-query";
import { getAlreadyFriends } from "@/api/apis";
import { LoaderCircle } from "lucide-react";
import FriendCard from "../dashboard/FriendCard";



export default function AlreadyFriends () {

    const getAlreadyFriendsQuery= useQuery({
        queryKey: ['getAlreadyFriends'],
        queryFn: () => getAlreadyFriends()
    })


    return (
        <div className="bg-emerald-500 w-full min-h-screen py-5 flex flex-col">
            <h1 className="font-bold text-3xl text-center text-white underline">Friends List</h1>

            <div className="flex flex-col gap-3 mt-5">
                {
                    getAlreadyFriendsQuery.isFetching ? (
                        <div className="flex w-full justify-center items-center">
                            <LoaderCircle size={50} className="animate-spin" />
                        </div>
                    ) : (
                        getAlreadyFriendsQuery.data.map( (friend: {username: string, email: string, userId: string}, i: number) => (
                            <FriendCard friend= {friend} key={i} type= {'alreadyFriend'}/>
                        ) )
                    )
                }
            </div>
        </div>
    )
}