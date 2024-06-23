import { and, eq, ne } from "drizzle-orm"
import { dbClient } from "../db/drizzle"
import { friendsRequestTable, roomRequestTable, roomsTable, userTable, usersToRoomsTable } from "../db/schema"
import { errorHandler } from "../utils/error"


export const getJoinedRooms= async (req, res, next) => {
    const userId= req.user.userId
    try {
        const rooms= await dbClient.select({
            roomId: roomsTable.roomId,
            roomName: roomsTable.roomName,
            isAdmin: usersToRoomsTable.isAdmin
        })
                                    .from(usersToRoomsTable)
                                    .where(eq(usersToRoomsTable.userId, userId))
                                    .innerJoin(roomsTable, eq(roomsTable.roomId, usersToRoomsTable.roomId))

        res.status(200).json({
            success: true,
            rooms
        })
    }
    catch(err) {
        console.log(err, 'Error in getJoinedRooms function')
        return next(errorHandler(500, 'Error in getJoinedRooms function'))
    }
}


export const createRoom= async (req, res, next) => {
    const userId= req.user.userId
    const roomName= req.body.roomName

    if (roomName.length < 1) {
        res.status(400).json({
            success: false,
            message: 'Room name cannot be empty'
        })
        return
    }

    try {
        const room = await dbClient.transaction( async (tx) => {
            const roomInfo= await dbClient.insert(roomsTable)
                                            .values({
                                                roomName: roomName
                                            })
                                            .returning()

            const userRoomInfo= await dbClient.insert(usersToRoomsTable)
                                                .values({
                                                    userId: userId,
                                                    roomId: roomInfo[0].roomId,
                                                    isAdmin: true
                                                })
        } )

        res.status(200).json({
            success: true,
            message: 'Room created successfully',
            room
        })
    }
    catch(err) {
        console.log(err, 'Error in createRoom function')
        return next(errorHandler(500, 'Error in createRoom function'))
    }
}


export const getRoomInfo= async (req, res, next) => {
    const userId= req.user.userId
    const roomId= req.params.roomId

    if (!roomId) {
        res.status(400).json({
            success: false,
            message: 'Please provide roomId'
        })
        return
    }

    try {
        const info = await dbClient.select(
            {
                userId: userTable.userId,
                userName: userTable.username,
                email: userTable.email,
            }
        )
                                    .from(usersToRoomsTable)
                                    .where(and( eq(usersToRoomsTable.roomId, roomId), ne(usersToRoomsTable.userId, userId) ))
                                    .innerJoin(userTable, eq(usersToRoomsTable.userId, userTable.userId))

        res.status(200).json({
            success: true,
            info
        })
    }
    catch(err) {
        console.log(err, 'Error in getRoomInfo function')
        return next(errorHandler(500, 'Error in getRoomInfo function'))
    }
}


export const sendJoinRoomRequest= async (req, res, next) => {
    const userId= req.user.userId
    const roomId= req.body.roomId
    const friendId= req.body.friendId

    if (!roomId || !friendId) {
        res.status(400).json({
            success: false,
            message: 'Please provide roomId and friendId'
        })
        return
    }

    try {
        const result= await dbClient.insert(roomRequestTable)
                                    .values({
                                        userId: userId,
                                        friendId: friendId,
                                        roomId: roomId
                                    })
                                    .onConflictDoNothing({target: [roomRequestTable.userId, roomRequestTable.friendId, roomRequestTable.roomId]})
                                    .returning()

        res.status(200).json({
            success: true,
            message: 'Request sent successfully',
            result
        })
    }
    catch(err) {
        console.log(err, 'Error in sendJoinRoomRequest function')
        return next(errorHandler(500, 'Error in sendJoinRoomRequest function'))
    }
}


export const getRoomRequests = async (req, res, next) => {
    const userId= req.user.userId

    try {
        const requests= await dbClient.select({
            userId: roomRequestTable.userId,
            username: userTable.username,
            roomId: roomRequestTable.roomId,
            roomName: roomsTable.roomName,
            email: userTable.email
        })
                                        .from(roomRequestTable)
                                        .innerJoin(userTable, eq(roomRequestTable.userId, userTable.userId))
                                        .innerJoin(roomsTable, eq(roomRequestTable.roomId, roomsTable.roomId))
                                        .where(eq(roomRequestTable.friendId, userId))
        
        res.status(200).json({
            success: true,
            requests
        })
    }
    catch(err) {
        console.log(err, 'Error in getRoomRequests function')
        return next(errorHandler(500, 'Error in getRoomRequests function'))
    }
}


export const acceptRoomRequest= async (req, res, next) => {
    const userId= req.user.userId
    const senderId= req.body.senderId
    const roomId= req.body.roomId

    if (!senderId || !roomId) {
        res.status(400).json({
            success: false,
            message: 'Please provide senderId and roomId'
        })
        return
    }

    try {
        const result= await dbClient.transaction( async (tx) => {
            const roomsTableUpdate= await dbClient.insert(usersToRoomsTable)
                                                    .values({
                                                        userId: userId,
                                                        roomId: roomId,
                                                        isAdmin: false
                                                    })
                                                    .returning()

            const roomRequestTableDelete= await dbClient.delete(roomRequestTable)
                                                        .where(and( eq(roomRequestTable.userId, senderId), eq(roomRequestTable.friendId, userId), eq(roomRequestTable.roomId, roomId)))

            return roomsTableUpdate
        } )

        res.status(200).json({
            success: true,
            message: 'Request accepted successfully',
            result
        })
    }
    catch(err) {
        console.log(err, 'Error in acceptRoomRequest function')
        return next(errorHandler(500, 'Error in acceptRoomRequest function'))
    }
}


export const leaveRoom= async (req, res, next) => {
    const userId= req.user.userId
    const roomId= req.params.roomId
    const isAdmin= req.params.isAdmin

    if (!roomId || !isAdmin) {
        res.status(400).json({
            success: false,
            message: 'Please provide roomId & isAdmin'
        })
        return
    }

    try {
        if (isAdmin) {
            await dbClient.transaction( async (ts) => {
                await dbClient.delete(usersToRoomsTable)
                                .where( eq(usersToRoomsTable.roomId, roomId))

                await dbClient.delete(roomsTable)
                                .where( eq(roomsTable.roomId, roomId))  
            })

            res.status(200).json({
                success: true,
                message: 'Room deleted successfully'
            })
        }

        else {
            await dbClient.delete(usersToRoomsTable)
                            .where(and( eq(usersToRoomsTable.userId, userId), eq(usersToRoomsTable.roomId, roomId)))

            res.status(200).json({
                success: true,
                message: 'Left room successfully'
            })
        }
    }
    catch(err) {
        console.log(err, 'Error in leaveRoom function')
        return next(errorHandler(500, 'Error in leaveRoom function'))
    }
}