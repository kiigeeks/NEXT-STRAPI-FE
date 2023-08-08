import { Inter } from 'next/font/google'
import Image from "next/image"
import { getAllAccounts, getSelectedAccount } from '@/api/services'
import ErrorNotFound from '@/components/Error';

const inter = Inter({ subsets: ['latin'] })

export default function SlugPage({ data }) {
    if (!data) {
        return (
            <ErrorNotFound />
        )
    }

    const handleLink = (data) => {
        if (data.status === "active"){
            window.open(data.url, '_blank', 'noopener noreferrer');
        }
    }

  	return (
		<main className={`flex min-h-screen max-w-2xl m-auto flex-col items-center p-4 pt-24 ${inter.className}`}>
            <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden mb-4 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30">
                <Image className="relative" layout="fill" objectFit="cover" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data?.attributes.photo.data.attributes.url.slice(1)}`} alt={data?.attributes.fullname} />
            </div>
			<div className='flex flex-col items-center gap-2 w-full mb-12'>
				<h3 className='text-2xl font-bold capitalize'>{data.attributes.fullname}</h3>
				<p className='text-lg capitalize'>{data.attributes.bio}</p>
			</div>
				
			<div className='flex flex-col items-center gap-5 w-full'>
                {data.attributes.links.data.map((value) => {
                    return (
                        <div 
                            onClick={() => handleLink(value.attributes)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            key={value.id} 
                            className={`${value.attributes.status === "deactive" && "hidden"} h-full w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-[24px] p-4 ${value.attributes.status === "active" && "cursor-pointer hover:scale-105 transition-all ease-in-out duration-300"} text-center capitalize flex flex-row`}
                        >
                            {value.attributes.icon.data &&
                                <div className="absolute w-11 h-11 left-2 self-center rounded-full overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30">
                                    <Image className="relative" layout="fill" objectFit="cover" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${value.attributes.icon.data?.attributes.url.slice(1)}`} alt={value.attributes.title} />
                                </div>
                            }
                            <span className="w-full">
                                {value.attributes.title}
                            </span>
                        </div>
                    )
                })}
			</div>
		</main>
	)
}

export async function getStaticPaths() {
    const accounts = await getAllAccounts();
  
    const dataAccounts = await accounts.data.data;
  
    const paths = dataAccounts.map((value) => {
        return {
            params: { slug: value.attributes.slug },
        };
    });
  
    return { paths, fallback: "blocking" };
}
  
export async function getStaticProps({ params }) {
    const selectedAccount = await getSelectedAccount(params.slug);
    
    return {
        props: {
            data: selectedAccount.data.data[0] ?? null,
        },
        revalidate: 10,
    };
}