import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
import friendsRoutes from "./routes/friendsRoutes"
import roomsRoutes from "./routes/roomRoutes"

dotenv.config()
const app= express()

// {
//     origin: process.env.FRONTEND_URL, // Allow only this origin
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
//     credentials: true, // Allow cookies to be sent
// }

app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    credentials: true, // Allow cookies to be sent
}))
app.use(express.json())
app.use(cookieParser())

app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.BACKEND_PORT}`)
})

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/friends", friendsRoutes)
app.use("/api/rooms", roomsRoutes)