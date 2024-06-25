import expres from 'express';
import { searchFriends, getAlreadyFriends, sendFriendRequest, getRecievedRequests, removeFriend , acceptFriendRequest, declineFriendRequest} from '../controllers/friendsControllers'
import { verifyUser } from '../utils/verifyUser.js';


const router= expres.Router()


router.get('/search/:searchTerm',verifyUser, searchFriends)
router.get('/alreadyFriends', verifyUser, getAlreadyFriends)
router.post('/sendFriendRequest', verifyUser, sendFriendRequest)
router.get('/recievedRequests', verifyUser, getRecievedRequests)
router.delete('/removeFriend/:friendId', verifyUser, removeFriend)
router.put('/acceptFriendRequest', verifyUser, acceptFriendRequest)
router.put('/declineFriendRequest', verifyUser, declineFriendRequest)

export default router