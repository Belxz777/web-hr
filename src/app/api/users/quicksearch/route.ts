import { NextResponse } from 'next/server'
import { host } from '@/types'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Декодируем параметры один раз
  const search = decodeURIComponent(searchParams.get('search') || '')
  const onlyMyDepartment = searchParams.get('only_mydepartment') === 'true'

  try {
    const cookieStore = cookies()
    const jwt = cookieStore.get('cf-auth-id')?.value

    if (!jwt) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Формируем URL без повторного кодирования
    const url = new URL(`${host}users/quicksearch/`)
    url.searchParams.append('search', search) // Уже декодировано
    url.searchParams.append('only_mydepartment', String(onlyMyDepartment))

    const response = await fetch(url.toString(), {
      headers: {
        Cookie: `jwt=${jwt}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}