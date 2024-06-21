import { memo } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import EditDialog from "./EditDialog"

type RoomCardProps = {
    roomId: string,
    roomName: string,
    isAdmin: boolean,
    type: string
}

const RoomCard = ({ roomId, roomName, isAdmin, type }: RoomCardProps) => {

    return (
        <div className="flex justify-evenly items-center w-full">
            <Card className="w-5/6 p-3">
                <div className="flex justify-between">
                    <div>
                        <p><span className="font-medium">Name:</span> {roomName}</p>
                    </div>

                    <div className="my-auto">
                        {
                            type === 'InRoomsList' ? (
                                <div className="flex flex-col gap-5 justify-center">
                                    <EditDialog roomId={roomId} roomName={roomName}  />
                                    <Button variant={'destructive'} size={"default"}>
                                        Leave
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5 justify-center">
                                    <Button variant={'destructive'} size={"sm"}>
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

export default memo(RoomCard)
