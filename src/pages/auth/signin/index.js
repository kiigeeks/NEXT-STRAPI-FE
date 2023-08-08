import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { authLogin } from '@/api/services';
import { useAuth } from '@/lib/auth';

const Login = () => {
	const router = useRouter();
    const { setToken } = useAuth();
    const [reqData, setReqData] = useState({
        slug: '',
        pin: ''
    })

    useEffect(() => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        if (userFromLocalStorage) {
            router.push("/dashboard")
        }
		// eslint-disable-next-line
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data } = await authLogin(reqData)
        
        const authData = data.data[0] ?? null

        if (!authData) {
            Swal.fire({
                title: 'Invalid Login!',
                text: 'Data yang Anda masukkan tidak sesuai',
                icon: 'error',
                confirmButtonText: 'Oke'
            })
            return
        }

        setToken(authData)
    }

    const handleChange = (e) => {
        setReqData({ ...reqData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-w-screen min-h-screen p-4 m-auto flex flex-col items-center">
            <div className="px-3 py-4 mt-16 w-[90%] md:w-1/4 h-fit flex flex-col gap-5 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-lg">
                <h1 className="text-center font-bold text-3xl tracking-widest">Login</h1>
                <form onSubmit={handleSubmit} className='mt-2 mb-3 px-5 w-full flex flex-col gap-4'>
                    <div className="flex flex-col w-full gap-1">
                        <span className=" font-light text-sm tracking-wide">Slug / Username</span>
                        <input 
                            type='text' 
                            name='slug'
                            onChange={handleChange}
                            className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a]" 
                            placeholder='Your slug or username'
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <span className=" font-light text-sm tracking-wide">PIN Code</span>
                        <input 
                            type='number' 
                            required
                            name='pin'
                            onChange={handleChange}
                            className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a]" 
                            placeholder='Your pin' 
                        />
                    </div>
                    <button type="submit" className="px-5 py-2 rounded-lg w-fit self-center mt-2 bg-[#24374d] border border-slate-500/50 hover:scale-105 hover:bg-[#2c445e] transition-all ease-in-out duration-300">Login</button>
                </form>
                <hr className="bg-slate-600 border-none h-[1px] w-[90%] self-center" />
                <div className="font-light text-xs w-full md:w-[90%] flex items-center justify-center text-center gap-2">
                    Belum pernah memiliki account?
                    <Link href={"/auth/signup"} className="underline underline-offset-4 text-sm">Daftar</Link>
                </div>
            </div>
        </div>
    )
}

export default Login