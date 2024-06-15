import { like } from "drizzle-orm"
import { dbClient } from "../db/drizzle"
import { userTable } from "../db/schema"


export const searchFriends= async (req, res, next) => {
    if (!req.params.searchTerm) {
        res.status(400).json({
            success: false,
            message: 'Please enter a search term'
        })
    }

    try {
        const searchTerm= req.params.searchTerm
        // console.log(searchTerm)
        const searchTerms= await dbClient.select().from(userTable).where(like(userTable.username, `%${searchTerm}%`)).limit(10)
        // console.log(searchTerms)
        res.status(200).json({
            success: true,
            searchTerms
        })
    }
    catch(err) {
        console.log(err, 'Error in searchFriends function')
        return next(errorHandler(500, 'Error in searchFriends function'))
    }
}