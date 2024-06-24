import { and, desc, eq, or } from "drizzle-orm"
import { dbClient } from "../db/drizzle"
import { friendsTable, personalMessagesTable, roomMessagesTable, usersToRoomsTable } from "../db/schema"
import { errorHandler } from "../utils/error"



export const getFriends= async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: 'getFriends'
    })
}


export const getSavedMessages= async (req, res, next) => {
    const userId= req.user.userId;

    try {
        const rooms= await dbClient.select({
            roomId: usersToRoomsTable.roomId
        })
                                    .from(usersToRoomsTable)
                                    .where(eq(usersToRoomsTable.userId, userId))
        // console.log('rooms', rooms)

        const finalSavedRoomMessages = await Promise.all(
            rooms.map(async (room) => {
                const roomId = room.roomId;
                const roomMessages = await dbClient.select({
                    from: roomMessagesTable.fromId,
                    roomId: roomMessagesTable.roomId,
                    message: roomMessagesTable.roomMessage,
                    time: roomMessagesTable.sentAt
                })
                .from(roomMessagesTable)
                .where(eq(roomMessagesTable.roomId, roomId))
                .orderBy(desc(roomMessagesTable.createdAt));
                
                return {
                    roomId: roomId,
                    messages: [...roomMessages]
                };
            })
        );
        // console.log('finalSavedRoomMessages', finalSavedRoomMessages)



        const friends= await dbClient.select({
            friendId: friendsTable.friendId,
        })
                                    .from(friendsTable)
                                    .where(eq(friendsTable.userId, userId))


        const finalSavedPerMessages= await Promise.all(
            friends.map(async (friend) => {
                const friendId= friend.friendId;
                const perMessages= await dbClient.select({
                                from: personalMessagesTable.fromId,
                                message: personalMessagesTable.perMessage,
                                time: personalMessagesTable.sentAt
                            })
                                                            .from(personalMessagesTable)
                                                            .where(or ( and( eq(personalMessagesTable.toId, userId), 
                                                                            eq(personalMessagesTable.fromId, friendId) ), 
                                                                        and( eq(personalMessagesTable.toId, friendId), 
                                                                            eq(personalMessagesTable.fromId, userId) ) 
                                                                    ))
                                                            .orderBy(desc(personalMessagesTable.createdAt))

                return (
                    {
                        friendId: friendId,
                        messages: [...perMessages]
                    }
                )
            } )
        )


        // console.log('finalSavedPerMessages', finalSavedPerMessages)
        // finalSavedPerMessages.forEach( (friend) => {
        //     // console.log('friendId', friend.friendId, 'messages', friend.messages)
        //     console.log(friend)
        // } )
        res.status(200).json({
            success: true,
            finalSavedRoomMessages,
            finalSavedPerMessages
        })
    }
    catch(err) {
        console.log(err, 'Error in getSavedMessages function')
        return next(errorHandler(500, 'Error in getSavedMessages function'))
    }

    // else if (type === "personalMessages") {
    //     const friendId= req.query.friendId;
    //     if (!friendId) {
    //         return res.status(400).json({
    //             success: false,
    //             message: 'FriendId is required'
    //         })
    //     }

    //     // console.log('friendId', friendId, 'userId', userId, "type", type)

    //     try {
    //         const messages= await dbClient.select({
    //             from: personalMessagesTable.fromId,
    //             message: personalMessagesTable.perMessage,
    //             time: personalMessagesTable.sentAt
    //         })
    //                                         .from(personalMessagesTable)
    //                                         .where(or ( and( eq(personalMessagesTable.toId, userId), 
    //                                                         eq(personalMessagesTable.fromId, friendId) ), 
    //                                                     and( eq(personalMessagesTable.toId, friendId), 
    //                                                         eq(personalMessagesTable.fromId, userId) ) 
    //                                                 ))
    //                                         .orderBy(desc(personalMessagesTable.createdAt))

    //         res.status(200).json({
    //             success: true,
    //             messages
    //         })
    //     }
    //     catch(err) {
    //         console.log(err, 'Error in getSavedMessages function')
    //         return next(errorHandler(500, 'Error in getSavedMessages function'))
    //     }
    // }
}