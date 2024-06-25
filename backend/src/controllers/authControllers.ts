import { eq, or } from 'drizzle-orm'
import { dbClient } from '../db/drizzle'
import { userTable } from '../db/schema'
import { errorHandler } from '../utils/error'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const signup = async (req, res, next) => {

    const email= req.body.email
    const password= req.body.password
    const username= req.body.username

    // console.log(req.body)
    if (!email || !password || !username){
        return next(errorHandler(400, 'Email, password and username are required'))
    }

    try {
        const existingUser= await dbClient.select().from(userTable).where( or(eq(userTable.email, email), eq(userTable.username, username)) )

        if(existingUser.length > 0){
            return next(errorHandler(400, 'User already exists'))
        }

        const hashedPassword= await bcryptjs.hash(password, 10)

        const newUser= await dbClient.insert(userTable).values({
            email: email,
            password: hashedPassword,
            username: username,
        }).returning()
        // console.log(newUser)

        const token= jwt.sign({userId: newUser[0].userId}, process.env.JWT)
        const {password: pass, ...others} = newUser[0]

        return res.status(201)
                    .cookie('token', token, { httponly: true, expires: new Date(Date.now() + 6*60*60*1000) })
                    .json(others)
    }
    catch(err){
        console.log(err)
        return next(errorHandler(500, 'Error in signup function'))
    }
}


export const login = async (req, res, next) => {
    const email= req.body.email
    const password= req.body.password

    if (!email || !password){
        return next(errorHandler(400, 'Email and password are required'))
    }

    try {
        const user= await dbClient.select().from(userTable).where(eq(userTable.email, email))
        if (user.length === 0) {
            return next(errorHandler(400, 'User not found'))
        }

        const hashedPassword= user[0].password
        const isPasswordCorrect= await bcryptjs.compare(password, hashedPassword)

        if (!isPasswordCorrect){
            return next(errorHandler(400, 'Invalid password'))
        }

        const token= jwt.sign({userId: user[0].userId}, process.env.JWT)
        const {password: pass, ...others} = user[0]

        return res.status(200)
                    .cookie('token', token, { httponly: true, expires: new Date(Date.now() + 6*60*60*1000) })
                    .json(others)
    }
    catch(err){
        console.log(err)
        return next(errorHandler(500, 'Error in login function'))
    }
}