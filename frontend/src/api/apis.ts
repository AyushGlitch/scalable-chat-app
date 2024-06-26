
import axios from "axios"

const axiosInstance= axios.create({baseURL: import.meta.env.VITE_BACKEND_URL})


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


export const getJoinedRooms= async () => {
    const response= await axiosInstance.get('/api/rooms/joinedRooms', {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data.rooms
}


export const createRoom= async (data: {roomName: string}) => {
    console.log("Data: ", data)
    const response= await axiosInstance.post('/api/rooms/createRoom', data, {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data
}


export const getRoomInfo= async (data: {roomId: string}) => {
    const response= await axiosInstance.get(`/api/rooms/roomInfo/${data.roomId}`, {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data.info
}


export const sendJoinRoomRequest= async (data: {roomId: string, friendId: string}) => {
    const response= await axiosInstance.post('/api/rooms/sendJoinRoomRequest', data, {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data
}


export const getRoomRequests= async () => {
    const response= await axiosInstance.get('/api/rooms/roomRequests', {withCredentials: true})
    console.log("Response: ", response.data)
    return response.data.requests
}


export const acceptRoomRequest= async (data: {senderId: string, roomId: string}) => {
    const response= await axiosInstance.post('/api/rooms/acceptRequest', data, {withCredentials: true})
    console.log(response)
    return response.data.result
}


export const leaveRoom= async (data: {roomId: string, isAdmin: boolean}) => {
    console.log("Data: ", data)
    const response= await axiosInstance.delete(`/api/rooms/leaveRoom/${data.roomId}/${data.isAdmin}`, {withCredentials: true})
    console.log("LeaveRoom Response: ", response.data)
    return response.data
}


export const removeMember= async (data: {roomId: string, friendId: string}) => {
    const response= await axiosInstance.delete(`/api/rooms/removeMember/${data.roomId}/${data.friendId}`, {withCredentials: true})
    console.log("RemoveMember Response: ", response.data)
    return response.data
}


export const roomNameChange= async (data: {roomId:string, roomName: string}) => {
    const response= await axiosInstance.put('/api/rooms/roomNameChange', data, {withCredentials: true})
    console.log("RoomNameChange Response: ", response.data)
    return response.data.result
}


export const declineRoomRequest= async (data: {senderId: string, roomId: string}) => {
    const response= await axiosInstance.delete(`/api/rooms/declineRoomRequest/${data.senderId}/${data.roomId}`, {withCredentials: true})
    console.log("DeclineFriendRequest Response: ", response.data)
    return response.data
}


export const getSavedMessages= async () => {
    const response= await axiosInstance.get('/api/dashboard/getSavedMessages', {withCredentials: true})
    console.log("SavedMessages Response: ", response.data)
    return response.data
}