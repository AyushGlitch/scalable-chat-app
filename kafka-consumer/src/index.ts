import { Kafka } from "kafkajs"
import { Pool } from "pg"
import { dbClient } from "./db/drizzle"
import { personalMessagesTable, roomMessagesTable } from "./db/schema"
import dotenv from 'dotenv'

dotenv.config()

const kafka= new Kafka({
    clientId: 'consumer',
    brokers: [process.env.KAFKA_BROKER!]
})

const consumer= kafka.consumer({groupId: 'chat-group'})
const topics= ['personalMessages', 'roomMessages']


const run = async () => {
    await consumer.connect()
    await consumer.subscribe({topics: topics, fromBeginning: true})

    await consumer.run({
        eachMessage: async ({ topic, partition, message, pause }) => {
            const data= JSON.parse(message.value!.toString())
            
            if (topic == topics[0]) {
                const from: string= data.from.userId
                const to: string= data.to
                const message: string= data.message
                const time: string= data.time

                try {
                    await dbClient.insert(personalMessagesTable).values({
                        fromId: from,
                        toId: to,
                        perMessage: message,
                        sentAt: time
                    })
                    console.log("Inserted personal message into database")
                }
                catch (err) {
                    console.log("Error inserting personal message into database: ", err)
                    pause();
                    setTimeout(() => {
                        consumer.resume([{ topic: topics[0] }]);
                    }, 60 * 1000);
                }
            }

            else if (topic == topics[1]) {
                const from: string= data.from.userId
                const roomId: string= data.roomId
                const message: string= data.message
                const time: string= data.time

                try {
                    await dbClient.insert(roomMessagesTable).values({
                        fromId: from,
                        roomId: roomId,
                        roomMessage: message,
                        sentAt: time
                    })
                    console.log("Inserted room message into database")
                }
                catch (err) {
                    console.log("Error inserting personal message into database: ", err)
                    pause();
                    setTimeout(() => {
                        consumer.resume([{ topic: topics[1] }]);
                    }, 60 * 1000);
                }
            }
        },
    })
}


run().catch(console.error)