import { WebSocket } from "ws"



export class User {
    public userId: string
    public socket: WebSocket

    constructor(userId: string, socket: WebSocket) {
        this.userId= userId
        this.socket= socket
    }
}


export class SocketManager {
    private static instance: SocketManager
    private usersMap: Map<string, WebSocket>
    private roomsMap: Map<string, User[]>
    private usersRoomsMap: Map<string, string[]>

    private constructor() {
        this.usersMap= new Map<string, WebSocket>()
        this.roomsMap= new Map<string, User[]>()
        this.usersRoomsMap= new Map<string, string[]>()
    }


    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance= new SocketManager()
            return SocketManager.instance
        }
        return SocketManager.instance
    }


    public addUser(user: User) {
        this.usersMap.set(user.userId, this.usersMap.get(user.userId) || user.socket)
        console.log(user.userId, "added to socketManager")
    }

    public addUserToRoom(roomId: string, user: User) {
        this.roomsMap.set(roomId, [
            ...(this.roomsMap.get(roomId) || []),
            user
        ])
        this.usersMap.set(user.userId, this.usersMap.get(user.userId) || user.socket) 
        this.usersRoomsMap.set(user.userId, [
            ...(this.usersRoomsMap.get(user.userId) || []),
            roomId
        ])
    }


    public sendPrivateMessage (to: User, from: User, message: string) {
        const toSocket= this.usersMap.get(to.userId)

        if (!toSocket) {
            console.log(`User ${to.userId} is not connected`)
            return
        }
        else {
            toSocket.send(message)
        }
    }


    public sendRoomMessage (from: User, roomId: string, message: string) {
        const room= this.roomsMap.get(roomId)

        if (!room) {
            this.addUserToRoom(roomId, from)
        }

        room?.forEach( (user) => {
            if (user.userId !== from.userId) {
                user.socket.send(message)
            }
        } )
    } 


    public removeUser(userId: string) {
        this.usersMap.delete(userId)

        const rooms= this.usersRoomsMap.get(userId)
        if (!rooms) {
            return
        }

        rooms.forEach( (roomId) => {
            const remainingUsers= this.roomsMap.get(roomId)?.filter( (user) => user.userId !== userId )

            if (remainingUsers?.length === 0) {
                this.roomsMap.delete(roomId)
            }
            else {
                this.roomsMap.set(roomId, remainingUsers!)
            }
        } )

        this.usersRoomsMap.delete(userId)
    }
}


export const socketManager= SocketManager.getInstance()