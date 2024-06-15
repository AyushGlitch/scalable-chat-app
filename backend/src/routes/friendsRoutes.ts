import expres from 'express';
import { searchFriends } from '../controllers/friendsControllers.js'


const router= expres.Router()


router.get('/search/:searchTerm', searchFriends)

export default router