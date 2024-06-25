import express from "express"
import { getFriends, getSavedMessages } from "../controllers/dashboardController"
import { verifyUser } from '../utils/verifyUser.js';


const router = express.Router()

router.get("/", getFriends)
router.get("/getSavedMessages", verifyUser, getSavedMessages)


export default router   