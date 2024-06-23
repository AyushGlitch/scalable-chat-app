import { Router } from "express";
import { verifyUser } from "../utils/verifyUser";
import { getJoinedRooms, createRoom, getRoomInfo, sendJoinRoomRequest, getRoomRequests, acceptRoomRequest, leaveRoom } from "../controllers/roomsControllers.js"


const router= Router()


router.get("/joinedRooms", verifyUser, getJoinedRooms)
router.post("/createRoom", verifyUser, createRoom)
router.get("/roomInfo/:roomId", verifyUser, getRoomInfo)
router.post("/sendJoinRoomRequest", verifyUser, sendJoinRoomRequest)
router.get("/roomRequests", verifyUser, getRoomRequests)
router.post("/acceptRequest", verifyUser, acceptRoomRequest)
router.delete("/leaveRoom/:roomId/:isAdmin", verifyUser, leaveRoom)


export default router