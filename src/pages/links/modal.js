import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { RiCloseFill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { updateMyLinks, uploadImage } from '@/api/services';

const DetailLink = ({ setShowModal, setFetchMore, dataLink }) => {
    const clickRef = useRef(null);
    const iconRef = useRef(null);
    const [icon, setIcon] = useState(null)
    const [title, setTitle] = useState(dataLink.attributes.title)
    const [url, setUrl] = useState(dataLink.attributes.url)
    const [status, setStatus] = useState(dataLink.attributes.status)
    const statusOptions = [
        {
            label: "ACTIVE",
            value: "active"
        },
        {
            label: "DEACTIVE",
            value: "deactive"
        },
        {
            label: "SUSPEND",
            value: "suspend"
        },
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (clickRef.current && !clickRef.current.contains(event.target)) {
                setShowModal(null)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickRef])

    const handleResetImage = () => {
        setIcon(null)
        iconRef.current.value = null;
    } 

    const handleSubmit = async (e) => {
        e.preventDefault();

        let iconData = dataLink.attributes.icon.data?.id
        
        if (icon) {
            const formData = new FormData();
            formData.append("files", icon);
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

            iconData = uploadedImage.data[0].id
        }

        const reqData = {
            title, url, status, account:dataLink.attributes.account.data.id, icon: iconData
        }

        const updatedData = await updateMyLinks(dataLink.id, reqData);

        if (updatedData.status !== 200) {
            Swal.fire({
                title: 'Error!',
                text: updatedData.data.error.message,
                icon: 'error',
                confirmButtonText: 'Oke'
            })
            
            return false
        }

        Swal.fire({
            title: 'Data Updated!',
            text: 'Data link berhasil dirubah',
            icon: 'success',
            confirmButtonText: 'Oke'
        })

        handleResetImage()
        setShowModal(false)
        setFetchMore(true)
    }

    return (
        <div className='absolute top-0 left-0 z-20 w-screen min-h-full bg-black  bg-opacity-70 p-3 flex items-center justify-center'>
            <div ref={clickRef} className="p-3 w-11/12 lg:w-1/3 md:w-1/2 h-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-md flex flex-col">
                <div className="px-2 flex justify-between items-center">
                    <h3 className='font-bold font-poppins text-xl md:text-2xl tracking-widest'>Detail Link {dataLink.attributes.title}</h3>
                    <RiCloseFill onClick={() => setShowModal(null)} className='w-8 h-8 cursor-pointer bg-red-900' />
                </div>
                <div className='mt-3 md:mt-5 w-full flex justify-center items-center'>
                    <div className='w-20 h-20 bg-slate-400 rounded-lg relative'>
                        {dataLink.attributes.icon.data ? (
                            <Image className="relative rounded-lg" layout="fill" objectFit="cover" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${dataLink.attributes.icon.data.attributes.url.slice(1)}`} alt={"Icon Link"} />
                        ) : ""}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='mt-4 md:mt-7 mb-3 px-5 w-full flex flex-wrap justify-between gap-2 md:gap-4' enctype="multipart/form-data">
                    <div className="flex flex-col w-full md:w-[45%] gap-1">
                        <span className="font-light text-xs md:text-sm tracking-wide">Title</span>
                        <input required type='text' name='title' value={title} onChange={(e) => setTitle(e.target.value)} className="px-4 w-full h-8 md:h-10 rounded-lg text-xs md:text-sm text-black focus:outline-none border border-[#0c253a]" placeholder='Input title' />
                    </div>
                    <div className="flex flex-col w-full md:w-[45%] gap-1">
                        <span className="font-light text-xs md:text-sm tracking-wide">status</span>
                        <select 
                            required 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                            className="px-2 w-full h-8 md:h-10 rounded-lg text-xs md:text-sm text-black focus:outline-none border border-[#0c253a]"
                        >
                            <option value="">Choose a status</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value} >{option.label} </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <span className="font-light text-xs md:text-sm tracking-wide">URL</span>
                        <input required type='url' name="url" value={url} onChange={(e) => setUrl(e.target.value)} className="px-4 w-full h-8 md:h-10 rounded-lg text-xs md:text-sm text-black focus:outline-none border border-[#0c253a]" placeholder='Input link url' />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <span className="font-light text-xs md:text-sm tracking-wide">New Icon</span>
                        <input
                            type="file"
                            name="icon"
                            id="icon"
                            ref={iconRef}
                            onChange={(e) => setIcon(e.target.files[0])}
                            accept='.png, .jpg, .jpeg'
                            className="block w-full text-xs md:text-sm text-slate-100
                                        file:mr-4 file:py-1 file:px-2 md:file:py-2 md:file:px-4
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
                    {icon && 
                        <div className="mt-3 w-20 h-20 relative flex flex-row bg-red-700">
                            <Image layout="fill" objectFit="cover" src={URL.createObjectURL(icon)} alt="Preview" className="w-1/4" />
                            <IoIosCloseCircle  
                                fontSize='20px' 
                                className='-mt-3 -ml-3 z-10 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-slate-100 rounded-full cursor-pointer' 
                                onClick={handleResetImage} />
                        </div>
                    }
                    
                    <div className='mt-2 flex flex-col w-full justify-center items-center'>
                        <button type="submit" className="px-5 py-2 w-fit mt-2 bg-[#341c37] border border-slate-500/50 hover:scale-105 hover:bg-[#412345] transition-all ease-in-out duration-300 rounded-md cursor-pointer">Submit</button>
                    </div>
                </form>
                
            </div>
                    
        </div>
    )
}

export default DetailLink