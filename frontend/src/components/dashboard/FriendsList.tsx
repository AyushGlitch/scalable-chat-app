import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { getAlreadyFriends, getJoinedRooms, searchFriends } from "@/api/apis";
import { LoaderCircle} from "lucide-react"
import FriendCard from "./FriendCard";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { CommandGroup } from "cmdk";


type SelectedFriendType = {
    username: string,
    email: string,
    userId: string
}

type SelectedRoomType = {
    roomName: string,
    roomId: string,
    isAdmin: boolean
}

type SelectedType = SelectedFriendType | SelectedRoomType


type FriendsListPropsType= {
    user: {
        email: string,
        username: string,
        userId: string
    }
    type :string
    handleSelectFriend: (selection: SelectedType) => void
}


export default function FriendsList({user, type, handleSelectFriend}: FriendsListPropsType) {

    if (type === "dashboard") {

        const getAlreadyFriendsQuery= useQuery({
            queryKey: ['getAlreadyFriends'],
            queryFn: () => getAlreadyFriends()
        })


        const joinedRoomsQuery= useQuery({
            queryKey: ['joinedRooms'],
            queryFn: () => getJoinedRooms()
        })

        if (getAlreadyFriendsQuery.isFetching || joinedRoomsQuery.isFetching) {
            return (
                <div className="flex w-full justify-center items-center">
                    <LoaderCircle size={50} className="animate-spin" />
                </div>
            )
        }
        

        return (
            <div className="w-2/6 min-h-screen py-5 flex flex-col">
                <Command className="w-11/12 mx-auto bg-slate-700 text-slate-300">
                    <CommandInput placeholder="Search" className="text-xl h-14" />
                    <CommandList>
                        <CommandEmpty className="text-2xl w-full text-center p-10">No Results</CommandEmpty>
                        <CommandGroup heading="Individuals" className="text-xl font-semibold my-3 mx-3" >
                            {
                                getAlreadyFriendsQuery.isFetched && getAlreadyFriendsQuery.data.map( (friend: SelectedFriendType, i: number) => (
                                    friend.email != user.email &&
                                    <CommandItem key={i} >
                                        <div className="text-lg font-normal flex w-full justify-between mx-3" onClick={() => handleSelectFriend!(friend)}>
                                            <h1>{friend.username}</h1>
                                            <h1>{friend.email.slice(0,10) + '...'}</h1>
                                        </div>
                                    </CommandItem>
                                ) )
                            }
                        </CommandGroup>

                        <CommandGroup heading="Rooms" className="text-xl font-semibold my-3 mx-3" >
                            {
                                joinedRoomsQuery.isFetched && joinedRoomsQuery.data.map( (room: SelectedRoomType, i: number) => (
                                    <CommandItem key={i} >
                                        <div className="text-lg font-normal flex w-full justify-between mx-3" onClick={() => handleSelectFriend(room)}>
                                            <h1>{room.roomName}</h1>
                                            <h1>{room.isAdmin && (
                                                    <span className="text-emerald-600 font-semibold">Admin</span>
                                                )}
                                            </h1>
                                        </div>
                                    </CommandItem>
                                ) )
                            }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
        )
    }

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
        <div className="bg-slate-700 w-full min-h-screen py-5 flex flex-col rounded-3xl">
            <h1 className="font-bold text-3xl text-center text-white underline">Search People</h1>

            <div className="flex w-full items-center space-x-2 p-3 mt-6 mb-5">
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