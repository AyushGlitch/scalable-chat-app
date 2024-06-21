import { Router } from "express";
import { verifyUser } from "../utils/verifyUser";
import { getJoinedRooms, createRoom, getRoomInfo, sendJoinRoomRequest } from "../controllers/roomsControllers.js"


const router= Router()


router.get("/joinedRooms", verifyUser, getJoinedRooms)
router.post("/createRoom", verifyUser, createRoom)
router.get("/roomInfo/:roomId", verifyUser, getRoomInfo)
router.post("/sendJoinRoomRequest", verifyUser, sendJoinRoomRequest)


export default router