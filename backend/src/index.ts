import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
import friendsRoutes from "./routes/friendsRoutes"

dotenv.config()
const app= express()

app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    credentials: true, // Allow cookies to be sent
}))
app.use(express.json())
app.use(cookieParser())

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server is running on port ${process.env.BACKEND_PORT}`)
})

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/friends", friendsRoutes)