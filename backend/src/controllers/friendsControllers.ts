import { and, eq, like, notInArray, or } from "drizzle-orm"
import { dbClient } from "../db/drizzle"
import { friendsRequestTable, friendsTable, userTable } from "../db/schema"
import { errorHandler } from "../utils/error"


export const searchFriends= async (req, res, next) => {
    if (!req.params.searchTerm) {
        res.status(400).json({
            success: false,
            message: 'Please enter a search term'
        })
    }

    try {
        const searchTerm= req.params.searchTerm
        const userId= req.user.userId
        // console.log(userId)
        // console.log(typeof(userId))
        const allreadyFriends= await dbClient.select({friendId: friendsTable.friendId}).from(friendsTable).where(eq(friendsTable.userId, userId))
        // console.log(allreadyFriends)
        const allReadyFriendsList= allreadyFriends.map( (friend) => (
            friend.friendId
        ) )
        allReadyFriendsList.push(userId)

        // console.log(allReadyFriendsList)
        const searchTerms= await dbClient.select({
            username: userTable.username, 
            email: userTable.email, 
            userId: userTable.userId
        })
        .from(userTable)
        .where(and( or(like(userTable.username, `%${searchTerm}%`), 
                        like(userTable.email, `%${searchTerm}%`)),
                notInArray(userTable.userId, allReadyFriendsList) ))
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


export const getAlreadyFriends= async (req, res, next) => {
    const userId= req.user.userId
    try {
        const friends= await dbClient.select({
                                            userId: userTable.userId,
                                            username: userTable.username,
                                            email: userTable.email
                                        })
                                    .from(friendsTable)
                                    .where(eq(friendsTable.userId, userId))
                                    .innerJoin(userTable, eq(friendsTable.friendId, userTable.userId))
        
        res.status(200).json({
            success: true,
            friends
        })
    }
    catch(err) {
        console.log(err, 'Error in getAlreadyFriends function')
        return next(errorHandler(500, 'Error in getAlreadyFriends function'))
    }
}


export const sendFriendRequest= async (req, res, next) => {
    const userId= req.user.userId
    const friendId= req.body.friendId
    
    if (!friendId) {
        res.status(400).json({
            success: false,
            message: 'Please provide friendId'
        })
    }

    try {
        const friendRequest= await dbClient.insert(friendsRequestTable)
                                            .values({
                                                userId: userId,
                                                friendId: friendId,
                                            })
                                            .onConflictDoNothing({target: [friendsRequestTable.userId, friendsRequestTable.friendId]})
                                            .returning()

        if (!friendRequest) {
            res.status(400).json({
                success: false,
                message: 'Friend request not sent'
            })
        }

        res.status(200).json({
            success: true,
            friendRequest
        })
    }
    catch(err) {
        console.log(err, 'Error in sendFriendRequest function')
        return next(errorHandler(500, 'Error in sendFriendRequest function'))
    }
}


export const getRecievedRequests= async (req, res, next) => {
    const userId= req.user.userId
    try {
        const recievedRequests= await dbClient.select({
            userId: userTable.userId,
            username: userTable.username,
            email: userTable.email,
        })
        .from(friendsRequestTable)
        .where(and( eq(friendsRequestTable.friendId, userId), eq(friendsRequestTable.status, 'pending') ))
        .innerJoin(userTable, eq(friendsRequestTable.userId, userTable.userId))

        res.status(200).json({
            success: true,
            recievedRequests
        })
    }
    catch(err) {
        console.log(err, 'Error in getRecievedRequests function')
        return next(errorHandler(500, 'Error in getRecievedRequests function'))
    }
}


export const removeFriend= async(req, res, next) => {
    const userId= req.user.userId
    const friendId= req.params.friendId

    if (!friendId) {
        res.status(400).json({
            success: false,
            message: 'Please provide friendId'
        })
    }

    try {
        const result= await dbClient.transaction( async (tx) => {
            await tx.delete(friendsTable)
                    .where( or( and( eq(friendsTable.userId, userId), eq(friendsTable.friendId, friendId)), and( eq(friendsTable.userId, friendId), eq(friendsTable.friendId, userId)) ))
        } )

        res.status(200).json({
            success: true,
            message: 'Friend removed'
        })
    }
    catch(err) {
        console.log(err, 'Error in removeFriend function')
        return next(errorHandler(500, 'Error in removeFriend function'))
    }
}


export const acceptFriendRequest= async (req, res, next) => {
    const userId= req.user.userId
    const friendId= req.body.friendId

    if (!friendId) {
        res.status(400).json({
            success: false,
            message: 'Please provide friendId'
        })
    }

    try {
        const result= await dbClient.transaction( async (tx) => {
            await tx.update(friendsRequestTable)
                    .set({
                        status: 'accepted'
                    })
                    .where(and( eq(friendsRequestTable.userId, friendId), eq(friendsRequestTable.friendId, userId)))

            await tx.insert(friendsTable)
                    .values([
                        {
                            userId: userId,
                            friendId: friendId
                        }, {
                            userId: friendId,
                            friendId: userId
                        }
                    ])
                    .onConflictDoNothing({target: [friendsTable.userId, friendsTable.friendId]})
        })

        res.status(200).json({
            success: true,
            message: 'Friend request accepted'
        })
    }
    catch (err) {
        console.log(err, 'Error in acceptFriendRequest function')
        return next(errorHandler(500, 'Error in acceptFriendRequest function'))
    }
}


export const declineFriendRequest= async (req, res, next) => {
    const userId= req.user.userId
    const friendId= req.body.friendId
    
    if (!friendId) {
        res.status(400).json({
            success: false,
            message: 'Please provide friendId'
        })
    }

    try {
        await dbClient.delete(friendsRequestTable)
                                    .where(and( eq(friendsRequestTable.userId, friendId), eq(friendsRequestTable.friendId, userId)))

        res.status(200).json({
            success: true,
            message: 'Friend request declined'
        })
    }
    catch(err) {
        console.log(err, 'Error in declineFriendRequest function')
        return next(errorHandler(500, 'Error in declineFriendRequest function'))
    }
}