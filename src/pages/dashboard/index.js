
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import Swal from 'sweetalert2';
import { IoIosCloseCircle } from "react-icons/io";
import Topbar from '@/components/Topbar';
import { useAuth } from '@/lib/auth';
import { updateProfile, uploadImage } from '@/api/services';

const Dashboard = () => {
    const { getMe, logout } = useAuth();
    const [userData, setUserData] = useState([])
    const [fullname, setFullname] = useState("")
    const [slug, setSlug] = useState("")
    const [bio, setBio] = useState("")
    const [pin, setPin] = useState("")
    const [photo, setPhoto] = useState(null)
    const photoRef = useRef(null);

    useEffect(() => {
        const responseData = getMe()
        setUserData(responseData)
        setFullname(responseData.attributes?.fullname)
        setSlug(responseData.attributes?.slug)
        setBio(responseData.attributes?.bio)

		// eslint-disable-next-line
    }, [])

    const handleResetImage = () => {
        setPhoto(null)
        photoRef.current.value = null;
    } 

    const handleSubmit = async (e) => {
        e.preventDefault();

        let photoData = userData.attributes.photo.data?.id

        if (photo) {
            const formData = new FormData();
            formData.append("files", photo);

            const uploadedImage = await uploadImage(formData)
            
            if (uploadedImage.status !== 200) {
                Swal.fire({
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

        const updatedData = await updateProfile(reqData, userData.id);

        if (updatedData.status !== 200) {
            Swal.fire({
                title: 'Error!',
                text: updatedData.data.error.message,
                icon: 'error',
                confirmButtonText: 'Oke'
            })
            return
        }

        Swal.fire({
            title: 'Data Updated!',
            text: 'Data profile berhasil diupdate, Silahkan login kembali',
            icon: 'success',
            confirmButtonText: 'Oke'
        })

        logout()
    }

    return (
        <div className='min-w-screen min-h-screen m-auto flex flex-col items-center'>
            {/* topbar */}
            <Topbar />

            {/* content */}
            <section className='px-5 md:px-7 mt-3 md:mt-12 mb-7 w-full flex flex-col md:flex-row justify-evenly items-center md:items-start'>
                {/* profile */}
                <div className='px-3 py-4 mt-5 w-[90%] md:w-[30%] font-poppins flex flex-col justify-center items-center bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-lg'>
                    <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden mb-7 mt-3 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30">
                        {userData.attributes?.photo.data ? (
                            <Image className="relative" layout="fill" objectFit="cover" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${userData.attributes?.photo.data?.attributes.url.slice(1)}`} alt={"Foto Profil"} />
                        ) : ( "")}
                    </div>
                    <div className='flex flex-col items-center gap-1 w-full mb-7'>
                        <h3 className='text-2xl font-bold capitalize'>{userData.attributes?.fullname}</h3>
                        <p className='text-lg capitalize'>{userData.attributes?.bio}</p>
                    </div>
                </div>
                {/* form update */}
                <div className='px-3 py-4 mt-5 w-[90%] md:w-[50%] flex flex-col bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-lg'>
                    <h1 className="text-center font-bold text-2xl md:text-3xl tracking-widest">Update data</h1>
                    <form onSubmit={handleSubmit} className='mt-3 md:mt-7 mb-3 px-5 w-full flex flex-wrap justify-between gap-4'>
                        <div className="flex flex-col w-full md:w-[30%] gap-1">
                            <span className="font-light text-sm tracking-wide">Fullname</span>
                            <input type='text' required name='fullname' value={fullname} onChange={(e) => setFullname(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='Your fullname' />
                        </div>
                        <div className="flex flex-col w-full md:w-[30%] gap-1">
                            <span className="font-light text-sm tracking-wide">Slug / Username</span>
                            <input type='text' required name='slug' value={slug} onChange={(e) => setSlug(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='Your slug or username' />
                        </div>
                        <div className="flex flex-col w-full md:w-[30%] gap-1">
                            <span className="font-light text-sm tracking-wide">New PIN</span>
                            <input type='number' required name="pin" value={pin} onChange={(e) => setPin(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='New PIN' />
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <span className="font-light text-sm tracking-wide">Bio</span>
                            <input type='text' required name="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a] " placeholder='Your slug or username' />
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <span className="font-light text-sm tracking-wide">New photo</span>
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
                        <div className='mt-2 flex flex-col w-full justify-center items-center'>
                            <button type="submit" className="px-5 py-2 w-fit mt-2 bg-[#341c37] border border-slate-500/50 hover:scale-105 hover:bg-[#412345] transition-all ease-in-out duration-300 rounded-md cursor-pointer">Submit</button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Dashboard