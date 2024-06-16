import { getRecievedRequests } from "@/api/apis";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import FriendCard from "../dashboard/FriendCard";




type RequestListProps = {
    user: {
        username: string;
        email: string;
        userId: string;
    }
}

export default function RequestList ({user}: RequestListProps) {

    const getRecievedRequestsQuery= useQuery({
        queryKey: ['getRecievedRequests'],
        queryFn: () => getRecievedRequests()
    })

    if (getRecievedRequestsQuery.isFetching) {
        return (
            <div className="flex w-full justify-center items-center">
                <LoaderCircle size={50} className="animate-spin" />
            </div>
        )
    }

    return (
        <div className="bg-blue-400 w-full min-h-screen py-5 flex flex-col">
            <h1 className="font-bold text-3xl text-center text-white underline">Friend Requests List</h1>

            <div className="flex flex-col gap-3 mt-5">
                {
                    getRecievedRequestsQuery.isFetching ? (
                        <div className="flex w-full justify-center items-center">
                            <LoaderCircle size={50} className="animate-spin" />
                        </div>
                    ) : (
                        getRecievedRequestsQuery.data.map( (friend: {username: string, userId: string, email: string}) => (
                            <FriendCard friend= {friend} key={friend.userId} type= {'recievedRequest'}/>
                        ) )
                    )
                }
            </div>
        </div>
    )
}