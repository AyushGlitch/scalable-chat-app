import { z } from 'zod';


export const signupSchema = z.object({
    email: z.string().email().min(5).max(50),
    password: z.string().min(6).max(10),
    username: z.string().min(3).max(20)
})


export type signupSchemaType= z.infer<typeof signupSchema>


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(10)
})

export type loginSchemaType= z.infer<typeof loginSchema>