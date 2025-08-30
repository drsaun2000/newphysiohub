'use client'
import { Home, User, Compass, ChevronDown, X, MessageSquareText, BookCopy, Settings, BookOpen, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import Cookies from "js-cookie"


const Sidebar = ({onClose}) => {
    const [user, setUser] = useState({})
    const router = useRouter()
    const pathname = usePathname()

    const handleSelect = (item) => {
        router.push('/user/'+item)
    };

    useEffect(()=>{
       setUser(JSON.parse( localStorage.getItem("user")))
    //    const user = Cookies.get("user")
    //    setUser(user)
    },[])

    return (
        <div className="flex min-h-[100%] w-[inherit]">
            <div className="flex flex-col w-64 bg-white shadow-xl sm:w-[100%] md:w-[fit-content]">
                <div className="flex flex-col w-[100%] justify-center items-center">
                    <div className="flex flex-col justify-center w-[100%] border-b h-[80px] pl-6 pr-6">
                        <div className="flex items-center justify-between h-[fit-content] ">
                            <div className="flex flex-col justify-cente items-center">
                                <Link href={"/"}>
                                <img src={"/logo-on-light.png"} className="md:hidden lg:block w-30 sm:w-50" />
                                </Link>
                            </div>
                            <div className="sm:block lg:hidden md:hidden flex flex-col justify-cente items-center">
                                <X size={25} onClick={onClose}/>
                            </div>
                        </div>
                        <Link href={"/"}>
                        <img src={"/symbollogo.png"} className="hidden sm:hidden md:block lg:hidden w-[40px]" />
                        </Link>
                    </div>
                </div>

                <div className="mt-10 pl-5 pr-5 h-full overflow-auto">
                    <button
                        onClick={() => {handleSelect('dashboard'); onClose()}}
                        className={`mb-4 flex items-center lg:space-x-2 md:space-x-0 space-x-2 cursor-pointer text-sm font-semibold p-4 rounded-lg w-full ${pathname === '/user/dashboard' ? 'bg-[#F6F9FC] text-[#7240FD]' : 'hover:bg-[#F6F9FC] hover:text-[#7240FD] text-[#687494]'}`}
                    >
                        <Home size={24} /> {/* Increased size for the icon */}
                        <span className="md:hidden lg:block">My Dashboard</span>
                    </button>

                    <button
                        onClick={() => {handleSelect('discover'); onClose()}}
                        className={`mb-4 flex items-center lg:space-x-2 md:space-x-0 space-x-2 text-sm cursor-pointer font-semibold p-4 rounded-lg w-full ${pathname === '/user/discover' ? 'bg-[#F6F9FC] text-[#7240FD]' : 'hover:bg-[#F6F9FC] hover:text-[#7240FD] text-[#687494]'}`}
                    >
                        <Compass size={24} /> {/* Increased size for the icon */}
                        <span className="md:hidden lg:block">Discover</span>
                    </button>
                    
                    <button
                        onClick={() => {handleSelect("quizs"); onClose()}}
                        className={`mb-4 flex items-center md:space-x-0 lg:space-x-2 space-x-2 text-sm cursor-pointer font-semibold p-4 rounded-lg w-full ${pathname === '/user/quizs' ? 'bg-[#F6F9FC] text-[#7240FD]' : 'hover:bg-[#F6F9FC] hover:text-[#7240FD] text-[#687494]'}`}
                    >
                        <MessageSquareText size={24} /> {/* Increased size for the icon */}
                        <span className="md:hidden lg:block">Quizzes</span>
                    </button>

                    <button
                        onClick={() => {handleSelect("flashcards"); onClose()}}
                        className={`mb-4 flex items-center md:space-x-0 lg:space-x-2 space-x-2 text-sm cursor-pointer font-semibold p-4 rounded-lg w-full ${pathname === '/user/flashcards' ? 'bg-[#F6F9FC] text-[#7240FD]' : 'hover:bg-[#F6F9FC] hover:text-[#7240FD] text-[#687494]'}`}
                    >
                        <BookCopy size={24} /> {/* Increased size for the icon */}
                        <span className="md:hidden lg:block">FlashCards</span>
                    </button>

                    <button
                        onClick={() => {handleSelect("bookmarks"); onClose()}}
                        className={`mb-4 flex items-center md:space-x-0 lg:space-x-2 space-x-2 text-sm cursor-pointer font-semibold p-4 rounded-lg w-full ${pathname === '/user/bookmarks' ? 'bg-[#F6F9FC] text-[#7240FD]' : 'hover:bg-[#F6F9FC] hover:text-[#7240FD] text-[#687494]'}`}
                    >
                        <Heart size={24} /> {/* Increased size for the icon */}
                        <span className="md:hidden lg:block">Bookmarks</span>
                    </button>

                    <button
                        onClick={() => {handleSelect('settings'); onClose()}}
                        className={`mb-4 flex items-center md:space-x-0 lg:space-x-2 space-x-2 text-sm cursor-pointer font-semibold p-4 rounded-lg w-full ${pathname === '/user/settings' ? 'bg-[#F6F9FC] text-[#7240FD]' : 'hover:bg-[#F6F9FC] hover:text-[#7240FD] text-[#687494]'}`}
                    >
                        <Settings size={24} /> {/* Increased size for the icon */}
                        <span className="md:hidden lg:block">Settings</span>
                    </button>
                    <Link 
                href={"/auth/login"}
                onClick={() => {localStorage.removeItem("token"); localStorage.removeItem("user")}}
                        className={`mb-4 flex items-center justify-center md:space-x-0 lg:space-x-2 space-x-2 text-sm cursor-pointer font-semibold p-4 rounded-lg w-full bg-[#F6F9FC] text-red-400 hover:text-red-500`}
                    >
                        <LogOut size={24} /> {/* Increased size for the icon */}
                        <span className="md:hidden lg:block">Logout</span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="mt-auto pl-2 pr-2 mb-5">
                    <div className="flex items-center md:justify-center lg:justify-between sm:justify-between justify-between w-[100%]  p-2 bg-white rounded-lg shadow-md border border-gray-200">
                        {/* Avatar */}
                        <div className="flex  items-center md:space-x-0 lg:space-x-4 space-x-4">
                        {user?.image?<div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src="https://i.pravatar.cc/150?img=5" // Placeholder avatar image
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div> : <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                            <User/>
                            </div> }
                            {/* User Information */}
                            <div className="md:hidden lg:block">
                                <div className="font-semibold text-gray-800">{user?.name}</div>
                                <div className="text-sm text-gray-400">{user?.email}</div>
                            </div>
                        </div>

                        {/* Icon */}
                        {/* <div className="flex flex-col md:hidden lg:block">
                            <ChevronDown className="text-gray-400 cursor-pointer transform rotate-180" size={20} />
                            <ChevronDown className="text-gray-400 cursor-pointer" size={20} />
                        </div> */}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Sidebar;
