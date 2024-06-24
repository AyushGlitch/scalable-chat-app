import { WebSocketServer } from "ws";
import url from 'url';
import { chatManager } from "./ChatManager";
import { User, socketManager } from "./SocketManager";
import { createClient } from "redis"
import { Kafka } from "kafkajs";
import { Partitioners } from "kafkajs";

const wss= new WebSocketServer({ port: 8080 });


const redisPublisher= createClient()
const redisSubscriber= createClient()


const kafka= new Kafka ({
    clientId: 'producer',
    brokers: ['localhost:9092']
})

const producer= kafka.producer({createPartitioner: Partitioners.DefaultPartitioner})
const topics= ['personalMessages', 'roomMessages']

async function initRedis() {
    await redisSubscriber.connect()
    await redisPublisher.connect()

    await producer.connect()

    redisSubscriber.subscribe('chatChannel', (message, channel) => {
        const data= JSON.parse(message)
    
        switch (data.type) {
            case 'personalMessage':
                const perMessToSend= JSON.stringify({
                    type: 'personalMessage',
                    from: data.from.userId,
                    message: data.message,
                    time: data.time
                })
                socketManager.sendPrivateMessage(data.to, data.from, perMessToSend)
    
                break
    
            case 'roomMessage':
                const roomMessToSend= JSON.stringify({
                    type: 'roomMessage',
                    from: data.from.userId,
                    roomId: data.roomId,
                    message: data.message,
                    time: data.time
                })
                socketManager.sendRoomMessage(data.from, data.roomId, roomMessToSend)
    
                break
        }
    })
}

initRedis().catch(console.error)


wss.on('connection', function connection(ws, req) {
    const userId= url.parse(req.url!, true).query.userId as string
    // console.log('Connected', userId, " ", ws)
    console.log('Connected', userId)
    chatManager.addUser(new User(userId, ws))

    ws.on('close', () => {
        chatManager.removeUser({userId: userId, socket: ws})
        console.log('Connection closed', userId)
    })
})

export { redisPublisher, producer, topics }