import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { getAllAccount, getSelectedAccount } from '@/api/services'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const router = useRouter();
	const [query, setQuery] = useState("")

	const searchPerson = (e) => {
		e.preventDefault()
		
		router.push(`/${query}`);
		return null
	}

  	return (
		<main
			className={`flex min-h-screen max-w-2xl m-auto flex-col items-center p-4 pt-24 ${inter.className}`}
		>
			<h1 className="mt-10 font-semibold text-2xl text-center">
				Aplikasi sederhana linktree menggunakan Next JS dan Strapi
			</h1>

			<form onSubmit={(e) => searchPerson(e)} className="mt-10 mb-5 w-full flex flex-row justify-center items-center">
                <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} className="px-4 w-[80%] h-10 rounded-xl text-md text-center text-black focus:outline-none border border-[##0c253a] " placeholder='Masukkan Slug' />
            </form>
		</main>
	)
}
