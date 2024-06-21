import InRoomsList from "@/components/rooms/InRoomsList";
import RoomRequestList from "@/components/rooms/RoomRequestList";



export default function Rooms() {

    return (
        <div className="grid grid-cols-2 p-5 gap-3">
            <InRoomsList />
            <RoomRequestList />
        </div>
    )
}