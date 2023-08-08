import React, { useEffect, useRef, useState } from 'react'
import Link from "next/link";
import Image from 'next/image';
import Swal from 'sweetalert2';
import { IoIosCloseCircle } from 'react-icons/io';
import { useRouter } from 'next/router';
import { authRegistrasi, uploadImage } from '@/api/services';

const SignUp = () => {
	const router = useRouter();
    const [fullname, setFullname] = useState("")
    const [slug, setSlug] = useState("")
    const [bio, setBio] = useState("")
    const [pin, setPin] = useState("")
    const [photo, setPhoto] = useState(null)
    const photoRef = useRef(null);

    useEffect(() => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        if (userFromLocalStorage) {
            router.push("/dashboard")
        }
		// eslint-disable-next-line
    }, [])

    const handleResetImage = () => {
        setPhoto(null)
        photoRef.current.value = null;
    } 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let photoData = null
        
        if (photo) {
            const formData = new FormData();
            formData.append("files", photo);
            const uploadedImage = await uploadImage(formData)
            
            if (uploadedImage.status !== 200) {
                Swall.fire({
                    title: 'Error upload image!',
                    text: uploadedImage.data.error.message,
                    icon: 'error',
                    confirmButtonText: 'Oke'
                })
                
                return false
            }

            photoData = uploadedImage.data[0].id
        }

        const reqData = {
            fullname, slug, bio, pin, photo: photoData
        }

        const createdData = await authRegistrasi(reqData);

        if (createdData.status !== 200) {
            Swal.fire({
                title: 'Error!',
                text: createdData.data.error.message,
                icon: 'error',
                confirmButtonText: 'Oke'
            })
            
            return false
        }

        Swal.fire({
            title: 'Data Created!',
            text: 'Account berhasil dibuat, segera login dan atur link profile Anda',
            icon: 'success',
            confirmButtonText: 'Oke'
        })

		router.push("/auth/signin");
    }

    return (
        <div className="min-w-screen min-h-screen p-4 m-auto flex flex-col items-center">
            <div className="px-3 py-4 mt-5 mb-5 w-[90%] md:w-1/4 h-fit flex flex-col gap-5 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-lg">
                <h1 className="text-center font-bold text-3xl tracking-widest">Registrasi</h1>
                <form onSubmit={handleSubmit} className='mt-2 mb-3 px-5 w-full flex flex-col gap-4'>
                    <div className="flex flex-col w-full gap-1">
                        <span className="font-light text-sm tracking-wide">Fullname</span>
                        <input type='text' required value={fullname} onChange={(e) => setFullname(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='Your fullname' />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <span className="font-light text-sm tracking-wide">Slug / Username</span>
                        <input type='text' required value={slug} onChange={(e) => setSlug(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='Your slug or username' />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <span className="font-light text-sm tracking-wide">Bio</span>
                        <input type='text' required value={bio} onChange={(e) => setBio(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='Your bio' />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <span className="font-light text-sm tracking-wide">PIN Code</span>
                        <input type='number' required value={pin} onChange={(e) => setPin(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='Your pin' />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <span className="font-light text-sm tracking-wide">Photo</span>
                        <input
                            type="file"
                            name="photo"
                            id="photo"
                            ref={photoRef}
                            onChange={(e) => setPhoto(e.target.files[0])}
                            accept='.png, .jpg, .jpeg'
                            className="block w-full text-sm text-slate-100
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-gray-50 file:text-gray-700
                                        hover:file:bg-gray-100"
                        />
                        <p 
                            className="mt-1 font-poppins italic text-[10px] text-gray-100 dark:text-gray-300" 
                            id="file_input_help"
                        >PNG, JPG, JPEG (MAX. 5MB).</p>    
                    </div>
                    {photo && 
                        <div className="mt-3 w-32 h-32 relative flex flex-row bg-red-700">
                            <Image layout="fill" objectFit="cover" src={URL.createObjectURL(photo)} alt="Preview" className="w-1/4" />
                            <IoIosCloseCircle  
                                fontSize='25px' 
                                className='-mt-3 -ml-3 z-10 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-slate-100 rounded-full cursor-pointer' 
                                onClick={handleResetImage} />
                        </div>
                    }
                    <button type="submit" className="px-5 py-2 w-fit self-center mt-2 bg-[#341c37] border border-slate-500/50 hover:scale-105 hover:bg-[#412345] transition-all ease-in-out duration-300 rounded-md cursor-pointer">Daftar</button>
                </form>
                <hr className="bg-slate-600 border-none h-[1px] w-[90%] self-center" />
                <div className="font-light text-xs w-full md:w-[90%] flex items-center justify-center text-center gap-2">
                    Sudah memiliki account?
                    <Link href={"/auth/signin"} className="underline underline-offset-4 text-sm">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp