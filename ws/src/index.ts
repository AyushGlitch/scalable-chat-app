import { WebSocketServer } from "ws";
import url from 'url';


const wss= new WebSocketServer({ port: 8080 });


wss.on('connection', function connection(ws, req) {
    const userId= url.parse(req.url!, true).query.userId as string
    console.log('Connected', userId, " ", ws)

    ws.on('close', () => {
        console.log('Connection closed')
    })
})