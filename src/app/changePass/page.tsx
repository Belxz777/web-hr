'use client'

import { useState } from 'react'
import changePassword from '@/components/server/passchange'
import { useRouter } from 'next/navigation'
import { changePass } from '@/types'
import { PulseLogo } from '@/svgs/Logo'
import UniversalFooter from '@/components/buildIn/UniversalFooter'


export default function ChangePassword() {
  const [showWarning, setShowWarning] = useState({
    status: false,
    text: ''
  })
const router = useRouter()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [showPassword, setShowPassword] = useState({
    oldpass:false,
    newpass:false,
    newpassconfirm:false
  });
  const [loading, setLoading] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<changePass>({
      old_password: '',
      new_password: ''
    });
  const handleSubmit = async(e: React.FormEvent) => {
setLoading(true);
    e.preventDefault()
    if (credentials.new_password!== confirmPassword) {
      setShowWarning({...showWarning, status: true, text:'Подтвержденный и новый пароль не совпадают' })
      setIsPopupVisible(true);
      setLoading(false);
      return
    } 
    if (credentials.new_password.length < 6 || !/[a-zA-Z]/.test(credentials.new_password)) {
      setShowWarning({...showWarning, status: true, text: 'Пароль должен содержать более 6 символов и хотя бы один символ' })
      setIsPopupVisible(true);
      setLoading(false);
      return
    }
if(credentials){
try{
  const req = await changePassword(credentials)
  if(req.detail){
  setShowWarning({...showWarning, status: true, text: req.detail })
  setIsPopupVisible(true);
  setLoading(false);
  return
}
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000);
    setLoading(false);
alert(req.message)
router.push('/login')
}
catch(error){
  console.error(error);
  setLoading(false);
setShowWarning({...showWarning, status: true, text: 'Не удалось изменить пароль' })
setIsPopupVisible(true);

}
}
    
  }

  return (
    <div className="divWrapper">
    <main className="mainWrapper">
      <header className="flex flex-col items-center">
        <PulseLogo className="pulseLogo" onClick={() =>router.push('/profile')} />
        <h1 className="textH1">Смена пароля</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="pass" className="labelStyles select-none">
            Старый пароль
          </label>
          <div className="relative">
            <input
              id="pass"
              name="pass"
              type={showPassword.oldpass ? 'text' : 'password'}
              required
              value={credentials.old_password}
              onChange={(e) => setCredentials({ ...credentials, old_password: e.target.value })}
              className="emailInputStyles"
            />
        <button
          type="button"
          className="redButtonStyles"
          onClick={() => setShowPassword({ ...showPassword, oldpass: !showPassword.oldpass })}
          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
        >
          <svg
            className="h-5 w-5 text-red-400"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            stroke="currentColor"
          >
            {showPassword.oldpass ? (
                 <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
            />
            ) : (
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
            />    
            )}
          </svg>
        </button>
          </div>
        </div>      
        <div>  
                  <label htmlFor="password"  className="labelStyles select-none">
         Новый пароль
          </label>
          <div className='relative'>
          <input
            id="password"
            name="password"
            autoComplete="current-password"
            type={showPassword.newpass ? 'text' : 'password'}
            required
            value={credentials.new_password}
            onChange={(e) => setCredentials({ ...credentials, new_password: e.target.value })}
            className="emailInputStyles"
            placeholder="********"
          />
        </div>
        </div>
        <div>
          <label htmlFor="propassword" className="labelStyles">
         Подтвердите пароль
          </label>
          <div className='relative'>
          <input
            id="propassword"
            name="propassword"
            type={showPassword.newpassconfirm  ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="emailInputStyles"
            placeholder="********"
          />
                  {/* <button
          type="button"
          className="redButtonStyles"
          onClick={() => setShowPassword({ ...showPassword, newpassconfirm: !showPassword.newpassconfirm })}
          aria-label={showPassword.newpassconfirm ? "Скрыть пароль" : "Показать пароль"}
        >
          <svg
            className="h-5 w-5 text-red-400"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            stroke="currentColor"
          >
            {showPassword.newpassconfirm? (
                 <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
            />
            ) : (
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
            />    
            )}
          </svg>
        </button> */}
        </div>
        </div>
        <div>
        <button
          type="submit"
          disabled={loading}
          className="submitButtonStyles"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Смена...
            </>
          ) : 'Поменять пароль'}
        </button>
        </div>
      </form>
    </main>
    <footer className="footerAuthStyles">
    </footer>
    
  {showWarning.status && (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isPopupVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      } flex items-center justify-center`}
    >
      <div 
        className={`bg-gray-800 p-6 rounded-xl shadow-xl transform transition-all duration-300 ease-in-out ${
          isPopupVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <h2 className="svgStyles">{showWarning.text}</h2>
        <button
          onClick={() => {
            setIsPopupVisible(false)
            setTimeout(() => setShowWarning({status: false, text: ''}), 300)          }}
          className="closePopUpStyles"
        >
          Закрыть
        </button>
      </div>
    </div>
  )}
<UniversalFooter/>
  </div>
  )
}

