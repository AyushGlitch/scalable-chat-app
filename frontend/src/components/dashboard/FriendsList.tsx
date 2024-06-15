import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";



export default function FriendsList() {
    const [searchBar, setSearchBar] = useState<string>("");


    return (
        <div className="bg-red-500 h-screen w-2/6">
            <div className="flex w-full items-center space-x-2 p-3">
                <Input type="text" placeholder="Search your friend..." value={searchBar} onChange={(e) => setSearchBar(e.target.value)}/>
                <Button type="submit">Search</Button>
            </div>

            <div>
                
            </div>
        </div>
    )
}