import React, { useState } from 'react'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { GiHamburgerMenu } from "react-icons/gi";

const Topbar = () => {
    const { logout } = useAuth();
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false)

    const isActive = (pathname) => {
      return router.pathname === pathname;
    };

    const handleLogout = () => {
        logout()
    };

    return (
        <>
        {showMenu && (
            <div className='absolute py-5 top-14 right-0 w-[95%] h-[40%] z-30 flex flex-col justify-around items-center bg-[#412345] rounded-md font-poppins text-xl tracking-wide cursor-pointer'>
                <span className={`${isActive('/dashboard') ? 'border-b border-b-white' : 'hover:text-2xl hover:font-medium transition-all ease-in-out duration-300'}`}><Link href="/dashboard">Profile</Link></span>
                <span className={`${isActive('/links') ? 'border-b border-b-white' : 'hover:text-2xl hover:font-medium transition-all ease-in-out duration-300'}`}><Link href="/links">Links</Link></span>
                <span onClick={handleLogout} className='px-7 py-2 bg-[#24374d] border border-slate-500/50 hover:scale-105 hover:bg-[#2c445e] transition-all ease-in-out duration-300 rounded-md cursor-pointer'>Logout</span>
            </div>
        )}
        <div className='w-full h-14 px-5 md:px-7 py-3 flex flex-row justify-between items-center'>
            <Link href={"/"} className="flex text-2xl font-bold tracking-wider font-poppins cursor-pointer">NEXT-STRAPI</Link>
            <div onClick={() => setShowMenu(!showMenu)} className='flex md:hidden h-fit cursor-pointer'>
                <GiHamburgerMenu className="text-3xl"/>
            </div>
            <ul className='hidden list-none md:flex flex-row items-center gap-10 font-poppins text-sm tracking-wide cursor-pointer'>
                <li className={`${isActive('/dashboard') ? 'border-b border-b-white' : 'hover:text-lg hover:font-medium transition-all ease-in-out duration-300'}`}><Link href="/dashboard">Profile</Link></li>
                <li className={`${isActive('/links') ? 'border-b border-b-white' : 'hover:text-lg hover:font-medium transition-all ease-in-out duration-300'}`}><Link href="/links">Links</Link></li>
                <li onClick={handleLogout} className='px-4 py-[7px] bg-[#341c37] border border-slate-500/50 hover:scale-105 hover:bg-[#412345] transition-all ease-in-out duration-300 rounded-md cursor-pointer'>Logout</li>
            </ul>
        </div>
        </>
    )
}

export default Topbar