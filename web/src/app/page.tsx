'use client'

import { AiFillGithub, AiFillAndroid, AiFillApple, AiFillChrome, AiOutlineDesktop } from 'react-icons/ai'
import Sheet from '../../public/sheets.svg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const access_token = localStorage.getItem("spreadsheet_access_token")
    if (access_token !== null) { // then check for validitiy of token
      return router.push("/spreadsheets")
    }
  }, [router]);

  return (
    <div className="w-full h-screen sm:flex bg-slate-200">
      <div className="h-full sm:w-[70%] flex flex-col align-middle justify-center p-20">
        <div className='flex justify-center mb-[8px]'>
          <span className="font-sans text-4xl font-semibold">Make data-driven decisions, in Work Sheets</span>
        </div>
        <div className='flex justify-center mb-[16px]'>
          <span className="font-sans text-xl font-normal">Create and collaborate on online spreadsheets in real-time and from any device.</span>
        </div>
        <video controls autoPlay muted className='w-[320px] h-[240px] sm:w-[70%] sm:h-[420px] mb-[16px] ml-auto mr-auto' src='https://spreadsheet-go-stack-spreadsheetbucket723bf244-qenzwpwiwofc.s3.ap-south-1.amazonaws.com/demo.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFxlMdzb4nAIqt9C79GYgPKCFErSbQc7%2F%2BC3pSO8wB9jAiEA78u%2FuAkmaG19pN9ZH5OV9H%2FNOL5b7A6dOlsA7hqG5RIq%2FwIIMhAAGgw0NzM1MzkxMjY3NTUiDOup4K3uAQJUXAn6%2FCrcAhyHS5iI%2BAWWaSzDHDZg1NplNdU7yjhP8TUc0ia%2B8ckg%2FDHeKxuxqeyl77FLEZSisQ9kUL44Ruv8NtIgusGKxhRHkh3%2BA9k5whrJOEgHeOZTBQ7bR0%2FDfx0VwW7UBwxkC6L9l37o7gwF7FKbd5N9TYYx0IeZv0qHnaQt3Oi762du74%2BN0wdTjSWXeYzRrs1EBfTldg%2F08mI7%2BY29iqtCRZJ6aJTg36%2Bb8Lrv%2BR%2FIapEePW06fjB9ZR7QoMQtrKlwphsCrKTZ2dtR5WCsTfbk3ihLbs%2FLrqfDGKAn8xkRwkfFbSy%2FMycryqZCkRAlics4Rds6N4UdX30t8iF%2B3eAzz5EQS7gB4TztYC21jYwJV3uTyT9d9Mseg0y8AqH8mKAt0mdKTjXxGaCG8lt%2B5RmIMwIsXe%2BDp5%2F2b0ponf1yAV9v5HjUjpVmNd%2FnSaIDeqBGfDGcTnw8sxsSkjsUczDwgq6yBjqzAvNdjSAPOGrYgYOg333bOU2ln%2F7qlKUh44J9jKVxam%2BBXih6u%2F%2BZF7X%2FVjjX4f2tKBfGuXu%2FBKB39x9VvHOT9We%2BYeawEMLjosF5Ie4qxEmbH6YDjroyCYZ5w%2BIQtCBgwr9E%2By6iHcQAvOmN9Ba1QZljfzBTN2ygSR45Y3ZmaX0UN1Y%2FrxDHNMQkp4%2Bu38xTWQUPZzQ62StEYcFkIXVz7idB7Mm4ChotMT8xbm1aV3zQurcix8DGijBxeINs%2BVnBQVF%2Br6lED5ylF711TajgomHogYnshpuBwkKQpNDCAhd01vgcBOSmhE0MxteYB4tqKkotcmc1XHNy%2F9zcZxT1myWqUe0kN%2Fj6P4T%2B5nPlJem38yczpntdmK5ASfUPUopmARh7soxnK2eE3%2BAxqhiIM2g0shg%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240520T170146Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAW4QJBUXRZZ4DB4IB%2F20240520%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=55bfbc02fa6aa1eddccf174e5d2f8b5b92fb66d1083e6b34ed16b6768b81c4a1'/>
        <div className='flex justify-center mb-[8px]'>
          <span className="font-sans text-3xl font-semibold">Available On:</span>
        </div>
        <div className="flex align-middle justify-center gap-3 mb-[8px]">
          <AiFillChrome className="w-[50px] h-[50px] hover:scale-[1.10] hover:cursor-pointer" />
          <AiFillAndroid className="w-[50px] h-[50px] hover:scale-[1.10] hover:cursor-pointer" />
          <AiFillApple className="w-[50px] h-[50px] hover:scale-[1.10] hover:cursor-pointer" />
          <AiOutlineDesktop className="w-[50px] h-[50px] hover:scale-[1.10] hover:cursor-pointer" />
        </div>
        <div className='flex justify-center mb-[8px]'>
          <span className="font-sans text-2xl font-normal">Check the code here: <a href="https://github.com/KaustubhSathe/spreadsheet" target='_blank' className='text-blue-500 hover:text-blue-700'>Github</a></span>
        </div>
        <div className='flex justify-center'>
          <span className="font-sans text-2xl font-normal">Want to know how I built this. Click here: <a href="https://www.udemy.com/user/kaustubh-sathe-5/" target='_blank' className='text-blue-500 hover:text-blue-700'>Udemy</a></span>
        </div>
      </div>
      <div className="h-full sm:w-[30%] text-center p-[8px]">
        <div className="border-[2px] h-full border-[#34a853] rounded-xl flex flex-col align-middle justify-center">
          <div className="flex align-middle justify-center gap-3 mb-[15px]">
            <Image title='Sheets' width={27} height={27} src={Sheet} alt="sheet-icon" className="mt-auto mb-auto" />
            <span className="mt-auto mb-auto font-sans font-bold text-xl">Work Sheets</span>
          </div>
          <div className='mb-[8px]'>
            <span className="font-bold">Welcome!!</span> &#128075;
          </div>
          <div>
            <span className="font-semibold font-sans">
              Login to unlock access to Work Sheets!!!
            </span>
          </div>
          <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`} className="hover:bg-[#34a853] hover:cursor-pointer hover:scale-[1.02] hover:shadow-md hover:shadow-black h-[40px] m-[8px] mt-[16px] bg-in rounded-xl flex align-middle justify-center gap-3 border-[2px] border-black">
            <AiFillGithub className="w-[25px] h-[25px] mt-auto mb-auto" />
            <span className='mt-auto mb-auto font-bold'>Continue with Github</span>
          </a>
        </div>
      </div>
    </div>
  )
}
