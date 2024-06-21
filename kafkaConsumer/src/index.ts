import { Kafka } from "kafkajs"
import { Pool } from "pg"
import { dbClient } from "./db/drizzle"
import { personalMessagesTable } from "./db/schema"


const kafka= new Kafka({
    clientId: 'consumer',
    brokers: ['localhost:9092']
})

const consumer= kafka.consumer({groupId: 'chat-group'})
const topics= ['personalMessages', 'roomMessages']


const pool= new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin12345',
    database: 'chat-app',
})


const run = async () => {
    await consumer.connect()
    await consumer.subscribe({topics: topics, fromBeginning: true})

    await consumer.run({
        eachMessage: async ({ topic, partition, message, pause }) => {
            const data= JSON.parse(message.value!.toString())
            
            if (topic == topics[0]) {
                const from: string= data.from.userId
                const to: string= data.to.userId
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
                        consumer.resume([{ topic: "MESSAGES" }]);
                    }, 60 * 1000);
                }
            }

            else if (topic == topics[1]) {

            }
        },
    })
}


run().catch(console.error)