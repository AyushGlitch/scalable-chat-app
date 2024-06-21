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