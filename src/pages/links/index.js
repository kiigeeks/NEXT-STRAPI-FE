import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import Swal from 'sweetalert2';
import { IoIosCloseCircle, IoIosTrash } from "react-icons/io";
import { MdVisibility } from "react-icons/md";
import { useAuth } from '@/lib/auth';
import { addLink, uploadImage, getAllMyLinks, deleteMyLinks } from '@/api/services';
import Topbar from '@/components/Topbar';
import DetailLink from './modal';

const MyLinks = () => {
    const { getMe } = useAuth();
    const [userData, setUserData] = useState([])
    const [detailLink, setDetailLink] = useState([])
    const [links, setLinks] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [fetchMore, setFetchMore] = useState(true)
    const [icon, setIcon] = useState(null)
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [status, setStatus] = useState("")
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
    const iconRef = useRef(null);

    useEffect(() => {
        const responseData = getMe()
        setUserData(responseData)
        fetchLinks(responseData.id)
        setFetchMore(false)
		// eslint-disable-next-line
    }, [fetchMore])

    const fetchLinks = async(userId) => {
        const allLinks = await getAllMyLinks(userId)

        if (allLinks.status !== 200) {
            Swal.fire({
                title: 'Error get data!',
                text: allLinks.data.error.message,
                icon: 'error',
                confirmButtonText: 'Oke'
            })
            
            return false
        }
        setLinks(allLinks?.data?.data);
    }

    const handleResetImage = () => {
        setIcon(null)
        iconRef.current.value = null;
    }

    const handleResetInput = () => {
        setTitle("")
        setStatus("")
        setUrl("")
        handleResetImage()
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let iconData = null
        
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
            title, url, status, account: userData, icon: iconData
        }

        const createdData = await addLink(reqData);

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
            text: 'Data link berhasil ditambahkan',
            icon: 'success',
            confirmButtonText: 'Oke'
        })

        handleResetInput()
        setFetchMore(true)
    }

    const deleteLink = async (deleteData) => {
        const result = await deleteMyLinks(deleteData.id)
        if (result.status !== 200) {
            Swal.fire({
                title: 'Error!',
                text: result.data.error.message,
                icon: 'error',
                confirmButtonText: 'Oke'
            })
            
            return false
        }

        Swal.fire({
            title: 'Data Deleted!',
            text: 'Data link '+ deleteData.attributes.title +' berhasil dihapus',
            icon: 'success',
            confirmButtonText: 'Oke'
        })
        fetchLinks(userData.id)
    }

    const handleDelete = async (confirmData) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: "Apakah Anda yakin ingin menghapus " + confirmData.attributes.title + "?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                deleteLink(confirmData)
            }
          })
    }

    const handleModal = (detailData) => {
        setShowModal(true)
        setDetailLink(detailData)
    }

    return (
        <>
            {showModal &&
                <DetailLink setShowModal={setShowModal} setFetchMore={setFetchMore} dataLink={detailLink} />
            }
            <div className={`${showModal ? "fixed" : ""} w-screen min-h-screen m-auto flex flex-col items-center`}>
                {/* topbar */}
                <Topbar />

                {/* content */}            
                <section className='px-5 md:px-7 mt-3 md:mt-12 mb-7 w-full flex flex-col md:flex-row justify-evenly items-center md:items-start'>
                    {/* list link */}
                    <div className='px-3 py-4 mt-5 w-[95%] md:w-[60%] font-poppins flex flex-col justify-center bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-lg'>
                        <h1 className='font-bold text-2xl md:text-3xl tracking-widest'>My Links</h1>
                        <table className='mt-5 w-full flex flex-col gap-3'>
                            {links.map((item) => {
                                return (
                                    <tr key={item.id} className='px-2 md:px-5 py-1 md:py-2 w-full flex gap-5 items-center bg-transparent text-lg hover:bg-slate-600 rounded-3xl transition-all ease-in-out duration-300 cursor-pointer'>
                                        <td className='w-0 md:w-[10%] hidden md:flex'>
                                            <div className='w-10 h-10 bg-slate-400 rounded-full relative'>
                                                {item.attributes.icon.data ? (
                                                    <Image className="relative rounded-full" layout="fill" objectFit="cover" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.icon.data.attributes.url.slice(1)}`} alt={"Icon Link"} />
                                                ) : ""}
                                            </div>
                                        </td>
                                        <td className='w-[55%] text-sm md:text-lg truncate'>{item.attributes.title}</td>
                                        <td className='w-[25%] md:w-[15%] text-[10px] md:text-base'>
                                            {item.attributes.status === 'active' && (
                                                <span className="px-2 md:px-3 py-1 md:py-2 bg-green-800 rounded-full uppercase">{item.attributes.status}</span>
                                            )}
                                            {item.attributes.status === 'deactive' && (
                                                <span className="px-2 md:px-3 py-1 md:py-2 bg-red-800 rounded-full uppercase">{item.attributes.status}</span>
                                            )}
                                            {item.attributes.status === 'suspend' && (
                                                <span className="px-2 md:px-3 py-1 md:py-2 bg-yellow-800 rounded-full uppercase">{item.attributes.status}</span>
                                            )}
                                        </td>
                                        
                                        <td className='w-[20%] p-1 flex flex-row justify-evenly items-center gap-1 text-xl md:text-2xl'>
                                            <MdVisibility onClick={() => handleModal(item)} className="text-slate-400 hover:text-slate-200 cursor-pointer"/>
                                            <IoIosTrash onClick={() => handleDelete(item)} className="text-slate-400 hover:text-slate-200 cursor-pointer"/>
                                        </td>
                                    </tr>
                            )})}
                        </table>
                    </div>
                    {/* form add link */}
                    <div className='px-3 py-4 mt-5 w-[95%] md:w-[30%] font-poppins flex flex-col justify-center items-center bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-lg'>
                        <h1 className="text-center font-bold text-2xl md:text-3xl tracking-widest">Create new data</h1>
                        <form onSubmit={handleSubmit} className='mt-7 mb-3 px-5 w-full flex flex-wrap justify-between gap-4' enctype="multipart/form-data">
                            <div className="flex flex-col w-full md:w-[45%] gap-1">
                                <span className="font-light text-sm tracking-wide">Title</span>
                                <input required type='text' name='title' value={title} onChange={(e) => setTitle(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a]" placeholder='Input title' />
                            </div>
                            <div className="flex flex-col w-full md:w-[45%] gap-1">
                                <span className="font-light text-sm tracking-wide">status</span>
                                <select 
                                    required 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)} 
                                    className="px-2 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a]"
                                >
                                    <option value="">Choose a status</option>
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value} >{option.label} </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col w-full gap-1">
                                <span className="font-light text-sm tracking-wide">URL</span>
                                <input required type='url' name="url" value={url} onChange={(e) => setUrl(e.target.value)} className="px-4 w-full h-10 rounded-lg text-sm text-black focus:outline-none border border-[#0c253a]" placeholder='Input link url' />
                            </div>
                            <div className="flex flex-col w-full gap-1">
                                <span className="font-light text-sm tracking-wide">Icon</span>
                                <input
                                    type="file"
                                    name="icon"
                                    id="icon"
                                    ref={iconRef}
                                    onChange={(e) => setIcon(e.target.files[0])}
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
                            {icon && 
                                <div className="mt-3 w-32 h-32 relative flex flex-row bg-red-700">
                                    <Image layout="fill" objectFit="cover" src={URL.createObjectURL(icon)} alt="Preview" className="w-1/4" />
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
        </>
    )
}

export default MyLinks
