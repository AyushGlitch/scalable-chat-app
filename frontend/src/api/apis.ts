
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


export type friendsSearchType = {
    searchTerm: string
}

export const searchFriends= async (data: friendsSearchType) => {
    const response= await axiosInstance.get(`/api/friends/search/${data.searchTerm}`, {withCredentials: true})
    return response.data.searchTerms
}


export const getAlreadyFriends= async () => {
    const response= await axiosInstance.get(`/api/friends/alreadyFriends`, {withCredentials: true})
    return response.data.friends
}


export const sendFriendRequest= async (data: {friendId: string}) => {
    const response= await axiosInstance.post(`/api/friends/sendFriendRequest`, data, {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data.friendRequest
}


export const getRecievedRequests= async () => {
    const response = await axiosInstance.get('/api/friends/recievedRequests', {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data.recievedRequests
}


export const removeFriendQuery= async (data: {friendId: string}) => {
    const response= await axiosInstance.delete(`/api/friends/removeFriend/${data.friendId}`, {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data
}


export const acceptFriendRequest= async (data: {friendId: string}) => {
    const response=  await axiosInstance.put('/api/friends/acceptFriendRequest', data, {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data
}


export const declineFriendRequest= async (data: {friendId: string}) => {
    const response= await axiosInstance.put('/api/friends/declineFriendRequest', data, {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data
}