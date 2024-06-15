import { Button } from "@/components/ui/button";
import { loginSchema, loginSchemaType } from "@/schema/authSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/apis";

export default function Login() {
    const user= useUserStore( (state) => state.user )
    const setUser= useUserStore( (state) => state.setUser )
    const navigate= useNavigate()
    
    const form= useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })


    const loginUserQuery = useMutation({
        mutationFn: (data: loginSchemaType) => loginUser(data),
        onSettled: async (data, error) => {
            if (error) {
                console.log("Error logging in user: ", error)
            } else {
                console.log("User logged in successfully")
                setUser(data)
                navigate('/dashboard')
            }
            form.reset({
                email: "",
                password: ""
            })
            console.log("User: ", user)
        }
    })


    const onSubmit = useCallback( (values: loginSchemaType) => {
        loginUserQuery.mutate(values)
    }, [] )


    return (
        <div className="flex flex-col w-screen h-screen justify-center items-center gap-10">
            <h1 className="text-2xl font-bold text-white">Log In</h1>
            <div className="flex gap-5">
                <div className="flex flex-col gap-5 p-10 justify-center items-center">
                    <Button variant={'default'} className="bg-red-400 w-full">
                        LogIn with Google
                    </Button>
                    <Button variant={'default'} className="bg-blue-500 w-full">
                        LogIn with Facebook
                    </Button>
                </div>

                <div className="w-1 h-3/4 bg-slate-400 my-auto rounded-full">

                </div>
                
                <div className="p-10 flex flex-col gap-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                            <FormField name="email"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-white font-normal text-base">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is the email you used to sign up
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField name="password"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-white font-normal text-base">Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Password created during sign up
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>

                    <Button variant={'destructive'} onClick={form.handleSubmit(onSubmit)}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}