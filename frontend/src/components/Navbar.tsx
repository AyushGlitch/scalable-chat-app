import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";



export default function Navbar () {
    const user = useUserStore( (state) => state.user )
    const location = useLocation()

    const currPath= location.pathname

    const handleClick = () => {
        // useUserStore.setState( () => ({
        //     user: {
        //         userId: '',
        //         email: '',
        //         username: '',
        //     }
        // }) )
    }

    const links= [
        {
            name: 'Dashboard',
            link: '/dashboard'
        },
        {
            name: 'Friends',
            link: '/friends'
        },
        {
            name: 'Rooms',
            link: '/rooms'
        },
        {
            name: 'Settings',
            link: '/settings'
        },
    ]

    return (
        <nav className="bg-slate-700 flex gap-5 p-3 items-center justify-between">
            <div className="text-white font-bold text-4xl">
                Chattr
            </div>

            <div className="flex gap-5 justify-center items-center">
                {
                    links.map( (link, i) => (
                            <Button variant={'ghost'} className={cn("p-5 w-28 text-base text-white ", currPath==link.link ? "bg-slate-400" : "bg-slate-600")} asChild>
                                <Link to={link.link}>
                                    {link.name}
                                </Link>
                            </Button>
                        ))
                }
            </div>
            
            {
                user.userId.length > 0 ? (
                    <div className="flex gap-5 justify-center items-center">
                        <div className="flex gap-5">
                            <h2 className="text-base font-normal text-white">
                                Welcome, <span className="font-bold">{user.username}</span>
                            </h2>
                            <h2 className="text-base font-normal text-white">
                                <span className="font-bold">Email:</span> {user.email}
                            </h2>
                        </div>
                        <Button variant={"default"} className="p-3 w-20" asChild onClick={handleClick}>
                            <Link to={'/login'}>
                                Log Out
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-5">
                        <Button variant={"default"} className="p-3 w-20" asChild>
                            <Link to={'/login'}>
                                Log In
                            </Link>
                        </Button>

                        <Button variant={"secondary"} className="p-3 w-20" asChild>
                            <Link to={'/signup'}>
                                Sign Up
                            </Link>
                        </Button>
                    </div>
                )
            }

            
        </nav>
    )
}