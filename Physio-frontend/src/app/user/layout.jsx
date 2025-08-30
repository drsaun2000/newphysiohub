'use client'

import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import { Menu } from 'lucide-react';
// import Cookies from "js-cookie"

export default function UserLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({})

  // Function to handle closing the sidebar
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

      useEffect(()=>{
          setUser(JSON.parse( localStorage.getItem("user")))
       //    const user = Cookies.get("user")
       //    setUser(user)
       },[])
  
  

  return (
    <div className="flex max-screen-w w-[100vw] h-[100vh] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-500 ease-in-out h-[100vh] sm:block md:block lg:block w-[80px] md:w-[80px] lg:w-[250px] ${
          isSidebarOpen ? 'translate-x-0 lg:translate-x-0 md:translate-x-0' : '-translate-x-full sm:-translate-x-full lg:translate-x-0 md:translate-x-0'
        } absolute sm:absolute md:relative lg:relative w-[100vw] sm:w-[100vw] md:w-[80px] lg:w-[250px]`} style={{zIndex:1024}}
      >
        <Sidebar onClose={handleSidebarClose} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-[100%]">
        <div className='flex justify-between w-[100%] p-6'>
            <Menu size={30} className='block sm:block lg:hidden md:hidden' onClick={()=>setSidebarOpen(true)}/>
        </div>
        <div className='flex flex-col w-[100%] overflow-y-auto  p-6 lg:p-4 md:p-6'>
        {children}
        </div>
      </div>
    </div>
  );
}
