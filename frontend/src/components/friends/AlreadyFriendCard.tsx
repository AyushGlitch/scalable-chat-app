import { Button } from "../ui/button"
import { Card } from "../ui/card"



type AlreadyFriendCardProps= {
    friend: {
        friendName: string,
        friendEmail: string
    }
}

export default function AlreadyFriendCard({friend}: AlreadyFriendCardProps) {

    return (
        <div className="flex justify-evenly items-center w-full my-5">
            <Card className="w-5/6 p-3">                 
                <div className="flex justify-between">
                    <div>
                        <p><span className="font-medium">Name:</span> {friend.friendName}</p>
                        <p><span className="font-medium">Email:</span> {friend.friendEmail}</p>
                    </div>

                    <div className="my-auto">
                        <Button variant={'destructive'} size={"sm"}>
                            Remove
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}