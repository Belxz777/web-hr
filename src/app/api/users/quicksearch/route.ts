import { NextResponse } from 'next/server'
import { host } from '@/types'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic' 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Получаем параметры как есть, без декодирования
  const search = searchParams.get('search') || ''
  const onlyMyDepartment = searchParams.get('only_mydepartment') === 'true'

  try {
    const cookieStore = cookies()
    const jwt = cookieStore.get('cf-auth-id')?.value

    

    // Формируем URL для бэкенда
    const backendUrl = new URL(`${host}users/quicksearch`)
    backendUrl.searchParams.append('search', search)
    backendUrl.searchParams.append('only_mydepartment', String(onlyMyDepartment))

    const response = await fetch(backendUrl.toString(), {
      headers: {
        Cookie: `jwt=${jwt}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error:', errorText)
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Ошибка при выполнении поиска' },
      { status: 500 }
    )
  }
}