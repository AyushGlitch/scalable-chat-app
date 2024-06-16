import { useQuery } from "@tanstack/react-query";
import { Card } from "../ui/card";
import { getAlreadyFriends } from "@/api/apis";
import { LoaderCircle } from "lucide-react";
import AlreadyFriendCard from "./AlreadyFriendCard";
import FriendCard from "../dashboard/FriendCard";



type AlreadyFriendsProps = {
    user: {
        username: string;
        email: string;
        userId: string;
    }
}

export default function AlreadyFriends ({user}: AlreadyFriendsProps) {

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