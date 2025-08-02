import logo from '../.././../public/logo_1_.svg'
import Image from 'next/image'
export const Symbol: React.FC<{ text: string }> = ({ text }) => {

  return (
  <div className="flex items-center gap-4">
    <Image src={logo} alt="logo" width={100} height={100} 
    onClick={()=>{window.location.href = "/profile"}} className='cursor-pointer hover:scale-110 transition-transform duration-300'
    unoptimized
	priority/>
<h1 className="text-2xl font-bold mb-6 select-none">{text}</h1>
  </div>
  )
}