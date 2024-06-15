import { signupUser, signupUserType } from "@/api/apis"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupSchema, signupSchemaType } from "@/schema/authSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useUserStore } from "@/store/userStore"
import { useNavigate } from "react-router-dom"



export default function Signup() {
    const user= useUserStore( (state) => state.user )
    const setUser= useUserStore( (state) => state.setUser )
    const navigate= useNavigate()

    const form = useForm<signupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            username: ""
        }
    })

    const signupUserQuery = useMutation({
        mutationFn: (data: signupUserType) => signupUser(data),
        onSettled: async (data, error) => {
            if (error) {
                console.log("Error signing up user: ", error)
                
            } else {
                console.log("User signed up successfully")
                setUser(data)
                navigate('/dashboard')
            }
            form.reset({
                email: "",
                password: "",
                username: ""
            })
            console.log("User: ", user)
        }
    })

    const onSubmit = useCallback((values: signupSchemaType) => {
        signupUserQuery.mutate(values)
    }, [signupUserQuery])

    return (
        <div className="flex flex-col w-screen h-screen justify-center items-center gap-10">
            <h1 className="text-2xl font-bold text-white">Sign Up</h1>
            <div className="flex gap-5">
                <div className="flex flex-col gap-5 p-10 justify-center items-center">
                    <Button variant={'default'} className="bg-red-400 w-full">
                        Sign Up with Google
                    </Button>
                    <Button variant={'default'} className="bg-blue-500 w-full">
                        Sign Up with Facebook
                    </Button>
                </div>

                <div className="w-1 h-3/4 bg-slate-400 my-auto rounded-full"></div>
                <div className="p-10 flex flex-col gap-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                            <FormField name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white font-normal text-base">Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your username" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is what your friends will see
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white font-normal text-base">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This email should be unique
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white font-normal text-base">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Remember this password
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" variant={'destructive'}>
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
