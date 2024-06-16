import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { searchFriends } from "@/api/apis";
import { LoaderCircle} from "lucide-react"
import FriendCard from "./FriendCard";


type FriendsListPropsType= {
    user: {
        email: string,
        username: string,
        userId: string
    }
}


export default function FriendsList({user}: FriendsListPropsType) {
    const [searchBar, setSearchBar] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState<boolean>(false);


    useEffect( ()  => {
        const timerId= setTimeout( () => {
            setIsSearchButtonClicked(false)
            setDebouncedSearchTerm(searchBar)
            console.log("Debounced Search Term: ", debouncedSearchTerm)
        }, 2000 )

        return () => {
            clearTimeout(timerId)
        }

    }, [searchBar])


    const searchFriendsQuery= useQuery({
        queryKey: ['searchFriends', debouncedSearchTerm],
        queryFn: () => searchFriends({searchTerm: debouncedSearchTerm}) ,
        enabled: debouncedSearchTerm.length > 0  
    })


    const handleSearch = useCallback(() => {
        setIsSearchButtonClicked(true);
        setDebouncedSearchTerm(searchBar);
    }, [searchBar]);

    
    const resultsToShow = isSearchButtonClicked
    ? searchFriendsQuery.data
    : searchFriendsQuery.data?.slice(0, 5);


    return (
        <div className="bg-red-500 w-full min-h-screen py-5 flex flex-col">
            <h1 className="font-bold text-3xl text-center text-white underline">Search People</h1>

            <div className="flex w-full items-center space-x-2 p-3 mt-6">
                <Input type="text" placeholder="Search for a friend..." value={searchBar} onChange={(e) => setSearchBar(e.target.value)}/>
                <Button type="submit" onClick={handleSearch}>Search</Button>
            </div>

            <div>
                {
                    searchFriendsQuery.isFetching ? (
                        <div className="flex w-full justify-center items-center">
                            <LoaderCircle size={50} className="animate-spin" />
                        </div>
                    ) : (
                        resultsToShow && resultsToShow.map((friend: { email: string, username: string, userId: string }, i: number) => (
                            friend.email != user.email &&
                            <FriendCard key={i} friend={friend} type="searchFriend" />
                        ) )
                    )
                }
            </div>
        </div>
    )
}