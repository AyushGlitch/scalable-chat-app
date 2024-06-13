import { Link } from "react-router-dom";
import { Button } from "./ui/button";



export default function Navbar () {

    return (
        <nav className="bg-slate-700 flex gap-5 p-3 items-center justify-between">
            <div className="text-white font-bold text-4xl">
                Chattr
            </div>

            <div className="flex gap-5">
                <Button variant={"default"} className="p-3 w-20" asChild>
                    <Link to={'/login'}>
                        Log In
                    </Link>
                </Button>

                <Button variant={"secondary"} className="p-3 w-20">
                    <Link to={'/signup'}>
                        Sign Up
                    </Link>
                </Button>
            </div>
        </nav>
    )
}