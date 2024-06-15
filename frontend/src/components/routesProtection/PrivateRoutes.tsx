import { useUserStore } from "@/store/userStore";
import { Navigate, Outlet } from "react-router-dom";



export default function PrivateRoutes() {
    const user= useUserStore( (state) => state.user )
    
    return (
        user.userId.length > 0 ? (<Outlet/>) : (<Navigate to="/login"/>)
    )
}