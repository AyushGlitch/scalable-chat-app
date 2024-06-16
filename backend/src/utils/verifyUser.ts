import { errorHandler } from "./error";
import jwt from 'jsonwebtoken'


export const verifyUser= (req: any, res: any, next: any) => {
    const token= req.cookies.token
    // console.log(token)
    if(!token){
        return next(errorHandler(401, 'Unauthorized'))
    }

    jwt.verify(token, process.env.JWT!, (err:any, user:any) => {
        if(err){
            return next(errorHandler(401, 'Unauthorized'))
        }
        req.user= user
        next()
    })
}