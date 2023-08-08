import React from 'react'
import Link from 'next/link';

const ErrorNotFound = () => {
    return (
        <div className={`h-screen w-screen m-auto flex flex-col justify-center items-center p-3 font-poppins`}>
            <h1 className="mb-5 text-3xl font-bold">Data Tidak Ditemukan</h1>
            <p className="mb-10 text-center tracking-wide font-medium text-lg">Maaf data atau halaman yang Anda cari tidak ditemukan.</p>
            <Link href={"/"} className="px-4 py-2 bg-[#341c37] border border-slate-500/50 hover:scale-105 hover:bg-[#412345] transition-all ease-in-out duration-300 rounded-md cursor-pointer">Home</Link>
        </div>
    )
}

export default ErrorNotFound