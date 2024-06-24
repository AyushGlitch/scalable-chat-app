import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { Card} from "../ui/card"
import { acceptFriendRequest, declineFriendRequest, removeFriendQuery, sendFriendRequest } from "@/api/apis"


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
    
    
    const removeFriend = useMutation({
        mutationFn: () => removeFriendQuery({friendId: friend.userId}),
        onSettled: (_, error) => {
            if (!error) {
                queryClient.invalidateQueries({queryKey: ['getAlreadyFriends']})
            }
        }
    })

    
    const sendFriendRequestQuery= useMutation({
        mutationFn: () => sendFriendRequest({friendId: friend.userId}),
        onSettled: () => {
            // queryClient.invalidateQueries({queryKey: ['getRecievedRequests']})
        }
    })


    const acceptFriendRequestQuery= useMutation({
        mutationFn: () => acceptFriendRequest({friendId: friend.userId}),
        onSettled: (_, error) => {
            if (!error) {
                queryClient.invalidateQueries({queryKey: ['getAlreadyFriends']})
                queryClient.invalidateQueries({queryKey: ['getRecievedRequests']})
            }
        }
    })


    const declineFriendRequestQuery= useMutation( {
        mutationFn: () => declineFriendRequest({friendId: friend.userId}),
        onSettled: (_, error) => {
            if (!error) {
                queryClient.invalidateQueries({queryKey: ['getRecievedRequests']})
            }
        }
    } )


    function handleRemoveFriend() {
        removeFriend.mutate()
    }
    
    function handleSendRequest() {
        sendFriendRequestQuery.mutate()
    }

    function handleAcceptFriendRequest() {
        acceptFriendRequestQuery.mutate()
    }

    function handleDeclineFriendRequest() {
        declineFriendRequestQuery.mutate()
    }

    return (
        <div className="flex justify-evenly items-center w-full">
            <Card className="w-5/6 p-3 bg-zinc-600 text-white">                 
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
                                    <Button variant={'destructive'} size={"sm"} onClick={handleAcceptFriendRequest}>
                                        Accept
                                    </Button>
                                    <Button variant={'default'} size={'sm'} onClick={handleDeclineFriendRequest}>
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