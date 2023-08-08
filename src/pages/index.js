import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const { getMe } = useAuth();
    const [userData, setUserData] = useState([])
	const router = useRouter();
	const [query, setQuery] = useState("")

	useEffect(() => {
        setUserData(getMe())
		// eslint-disable-next-line
	}, []) 

	const searchPerson = (e) => {
		e.preventDefault()
		
		router.push(`/${query}`);
		return null
	}

  	return (
		<main className={`flex min-h-screen max-w-2xl m-auto flex-col items-center p-4 pt-24 ${inter.className}`}>
			<h1 className="mt-10 font-semibold text-2xl text-center">
				Aplikasi sederhana linktree menggunakan Next JS dan Strapi
			</h1>

			<form onSubmit={(e) => searchPerson(e)} className="mt-10 mb-5 w-full flex flex-row justify-center items-center">
                <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} className="px-4 w-[90%] md:w-[70%] h-10 rounded-xl text-sm text-center text-black focus:outline-none border border-[#0c253a] " placeholder='Masukkan slug yang ingin dicari' />
            </form>

			{userData ? (
				<div className="mt-7 font-light text-base flex flex-row justify-center items-center gap-5">
					<Link href={"/dashboard"} className="px-4 py-2 bg-[#341c37] border border-slate-500/50 hover:scale-105 hover:bg-[#412345] transition-all ease-in-out duration-300 rounded-md cursor-pointer">Dashboard</Link>
				</div>
			) : (
				<div className="mt-7 font-light text-base flex flex-row justify-center items-center gap-5">
					<Link href={"/auth/signin"} className="px-4 py-2 bg-[#24374d] border border-slate-500/50 hover:scale-105 hover:bg-[#2c445e] transition-all ease-in-out duration-300 rounded-md cursor-pointer">Login</Link>
					<Link href={"/auth/signup"} className="px-4 py-2 bg-[#341c37] border border-slate-500/50 hover:scale-105 hover:bg-[#412345] transition-all ease-in-out duration-300 rounded-md cursor-pointer">Daftar</Link>
				</div>
			)}
		</main>
	)
}
