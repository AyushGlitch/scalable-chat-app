import expres from 'express';
import { searchFriends, getAlreadyFriends, sendFriendRequest, getRecievedRequests } from '../controllers/friendsControllers.js'
import { verifyUser } from '../utils/verifyUser.js';


const router= expres.Router()


router.get('/search/:searchTerm',verifyUser, searchFriends)
router.get('/alreadyFriends', verifyUser, getAlreadyFriends)
router.post('/sendFriendRequest', verifyUser, sendFriendRequest)
router.get('/recievedRequests', verifyUser, getRecievedRequests)

export default router