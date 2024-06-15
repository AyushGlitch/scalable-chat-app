
import axios from "axios"

const axiosInstance= axios.create({baseURL: "http://localhost:3000"})


export type signupUserType= {
    email: string,
    password: string,
    username: string
}

export const signupUser = async (data: signupUserType) => {
    const response= await axiosInstance.post('/api/auth/signup', data, {withCredentials: true})
    // const setUser= useUserStore((state) => state.setUser)
    // setUser(response.data)
    return (response.data)
}


export type loginUserType = {
    email: string,
    password: string
}

export const loginUser= async (data: {email: string, password: string}) => {
    const response = await axiosInstance.post('/api/auth/login', data, {withCredentials: true})
    // console.log("Response: ", response.data)
    return response.data
}