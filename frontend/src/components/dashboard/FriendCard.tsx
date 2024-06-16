import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { Card} from "../ui/card"
import { sendFriendRequest } from "@/api/apis"


type FriendCardPropsType= {
    friend: {
        email: string,
        username: string,
        userId: string
    },
    type: string
}

export default function FriendCard({friend, type}: FriendCardPropsType) {
    const queryClient= useQueryClient()
    
    function handleRemoveFriend() {
        alert("Remove friend")
    }


    const sendFriendRequestQuery= useMutation({
        mutationFn: () => sendFriendRequest({friendId: friend.userId}),
        onSettled: () => {
            // queryClient.invalidateQueries({queryKey: ['getRecievedRequests']})
        }
    })

    function handleSendRequest() {
        sendFriendRequestQuery.mutate()
    }

    return (
        <div className="flex justify-evenly items-center w-full my-5">
            <Card className="w-5/6 p-3">                 
                <div className="flex justify-between">
                    <div>
                        <p><span className="font-medium">Name:</span> {friend.username}</p>
                        <p><span className="font-medium">Email:</span> {friend.email}</p>
                    </div>

                    <div className="my-auto">
                        {
                            type === 'alreadyFriend' ? (
                                <Button variant={'destructive'} size={"sm"} onClick={handleRemoveFriend}>
                                    Remove
                                </Button>
                            ) : type === 'searchFriend' ? (
                                <Button variant={'destructive'} size={"sm"} onClick={handleSendRequest}>
                                    Send Request
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-5 justify-center">
                                    <Button variant={'destructive'} size={"sm"} onClick={handleSendRequest}>
                                        Accept
                                    </Button>
                                    <Button variant={'default'} size={'sm'}>
                                        Decline
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Card>
        </div>
    )
}