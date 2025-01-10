'use client'

import { useState } from 'react'
import changePassword from '@/components/server/passchange'
import { useRouter } from 'next/navigation'
import { changePass } from '@/types'
import { PulseLogo } from '@/svgs/Logo'

export default function ChangePassword() {
  const [showWarning, setShowWarning] = useState(false)
const router = useRouter()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [loading, setLoading] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<changePass>({
      old_password: '',
      new_password: ''
    });
  const handleSubmit = async(e: React.FormEvent) => {
setLoading(true);
    e.preventDefault()
    if (credentials.new_password!== confirmPassword) {
      setShowWarning(true)
      alert('Пароли не совпадают')
      setLoading(false);
      return
    } else {
if(credentials){
try{
  const req = await changePassword(credentials)
  if(req.detail){
  alert(req.detail)
  setLoading(false);
  return
}
    setIsPopupVisible(true);
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
  alert('Неверный пароль')

}
}
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 flex flex-col items-center justify-center p-4">
    <main className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full space-y-8">
      <header className="flex flex-col items-center">
        <PulseLogo className="w-16 h-16 text-red-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-100">Смена пароля</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="pass" className="block text-sm font-medium text-gray-300  select-none">
            Старый пароль
          </label>
          <input
            id="pass"
            name="pass"
            type="password"
            required
            value={credentials.old_password}
            onChange={(e) => setCredentials({ ...credentials, old_password: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
    
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
         Новый пароль
          </label>
          <input
            id="password"
            name="password"
            type="password" 
            autoComplete="current-password"
            required
            value={credentials.new_password}
            onChange={(e) => setCredentials({ ...credentials, new_password: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="********"
          />
        </div>
        <div>
          <label htmlFor="propassword" className="block text-sm font-medium text-gray-300">
         Подтвердите пароль
          </label>
          <input
            id="propassword"
            name="propassword"
            type="password" 
            autoComplete="current-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="********"
          />
        </div>
        <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
    <footer className="mt-8 text-center text-gray-400">
    </footer>
    
  {showWarning && (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isPopupVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      } flex items-center justify-center`}
    >
      <div 
        className={`bg-gray-800 p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out ${
          isPopupVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <h2 className="text-xl font-bold text-red-500 mb-4">Ошибка</h2>
        <button
          onClick={() => {
            setIsPopupVisible(false)
            setTimeout(() => setShowWarning(false), 300)
          }}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Закрыть
        </button>
      </div>
    </div>
  )}
  </div>
  )
}

