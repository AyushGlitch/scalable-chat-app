import { producer, redisPublisher, topics } from "."
import { User, socketManager } from "./SocketManager"



export class ChatManager {
    private static instance: ChatManager
    private usersMap: Map<string, User>


    private constructor() {
        this.usersMap= new Map<string, User>()
    }


    public static getInstance() {
        if (!ChatManager.instance) {
            ChatManager.instance = new ChatManager()
            return ChatManager.instance
        }
        return ChatManager.instance
    }


    public addUser (user: User) {
        this.usersMap.set(user.userId, this.usersMap.get(user.userId) || user)
        console.log(user.userId, "added to chatManager")
        socketManager.addUser(user)
        this.addHandlers(user)
    }


    public removeUser (user: User) {
        this.usersMap.delete(user.userId)
        socketManager.removeUser(user.userId)
    }


    private addHandlers(user: User) {
        user.socket.on('message', async (data) => {
            const message= JSON.parse(data.toString())

            switch (message.type) {
                case 'joinRooms':
                    message.rooms.forEach(  (roomId: string) => {
                        socketManager.addUserToRoom(roomId, user)
                    })
                    console.log("User joined rooms: ", message.rooms)
                    break

                case 'personalMessage':
                    const to= this.usersMap.get(message.to)

                    if (!to) {
                        console.log(`User ${message.to} is not connected`)
                        return
                    }

                    const newPerMessage= {
                        type: 'personalMessage',
                        from: user,
                        to: to,
                        message: message.message,
                        time: message.time
                    }
                    // console.log("Created new personal message: ", newPerMessage)

                    redisPublisher.publish('chatChannel', JSON.stringify(newPerMessage))
                    await producer.send({
                        topic: topics[0],
                        messages: [{
                            value: JSON.stringify(newPerMessage)
                        }]
                    })
                    console.log("Sent personal message to Kafka: ", [user.userId, to.userId, message.message, message.time])

                    // socketManager.sendPrivateMessage(to, user, JSON.stringify({
                    //     type: 'personalMessage',
                    //     message: message.message,
                    //     time: message.time
                    // }))
                    // console.log(`Message: ${message.message}`)
                    // console.log(`Time: ${message.time}`)
                    break


                case 'roomMessage':
                    const roomId= message.roomId

                    const newRoomMessage= {
                        type: 'roomMessage',
                        from: user,
                        roomId: roomId,
                        message: message.message,
                        time: message.time
                    }

                    redisPublisher.publish('chatChannel', JSON.stringify(newRoomMessage))
                    await producer.send({
                        topic: topics[1],
                        messages: [{
                            value: JSON.stringify(newRoomMessage),
                        }]
                    })

                    // socketManager.sendRoomMessage(user, roomId, JSON.stringify({
                    //     type: 'roomMessage',
                    //     message: message.message,
                    //     time: message.time
                    // }))
                    break

                case 'removeUser':
                    this.removeUser(user)
                    break
            }
        })
    }
}


export const chatManager= ChatManager.getInstance()