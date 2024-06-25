import { Router } from "express";
import { verifyUser } from "../utils/verifyUser";
import { getJoinedRooms, createRoom, getRoomInfo, sendJoinRoomRequest, getRoomRequests, acceptRoomRequest, leaveRoom, removeMember, roomNameChange, declineRoomRequest } from "../controllers/roomsControllers"


const router= Router()


router.get("/joinedRooms", verifyUser, getJoinedRooms)
router.post("/createRoom", verifyUser, createRoom)
router.get("/roomInfo/:roomId", verifyUser, getRoomInfo)
router.post("/sendJoinRoomRequest", verifyUser, sendJoinRoomRequest)
router.get("/roomRequests", verifyUser, getRoomRequests)
router.post("/acceptRequest", verifyUser, acceptRoomRequest)
router.delete("/leaveRoom/:roomId/:isAdmin", verifyUser, leaveRoom)
router.delete("/removeMember/:roomId/:friendId", verifyUser, removeMember)
router.put("/roomNameChange", verifyUser, roomNameChange)
router.delete("/declineRoomRequest/:senderId/:roomId", verifyUser, declineRoomRequest)


export default router