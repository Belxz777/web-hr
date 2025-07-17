'use client'
import { useState, useEffect, useCallback } from 'react'

interface User {
  id: number
  name: string
  position: string
  department: string
  avatar?: string
}

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyMyDepartment, setOnlyMyDepartment] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounce = useCallback((fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }, [])

  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([])
      return
    }

    setLoading(true)
    setError(null)

    
    try {
      // Используем URLSearchParams для правильного кодирования
      const params = new URLSearchParams()
      params.append('search', query) // Автоматически кодируется один раз
      params.append('only_mydepartment', String(onlyMyDepartment))

      const response = await fetch(`/api/users/quicksearch?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to load search results')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedFetch = useCallback(
    debounce((query: string) => fetchUsers(query), 300),
    [onlyMyDepartment]
  )

  useEffect(() => {
    debouncedFetch(searchTerm)
  }, [searchTerm, onlyMyDepartment, debouncedFetch])

  return (
       <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-medium text-gray-900 mb-8 text-center">Поиск сотрудников</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Поиск по имени или должности..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900"
        />
      </div>
{loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      <div className="space-y-3">
        {users.map((employee) => (
          <div
            key={employee.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <div>
              <h3 className="font-medium text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-600">{employee.position}</p>
            </div>
            <button
              onClick={() => {}}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              Посмотреть
            </button>
          </div>
        ))}

        {!loading && searchTerm && users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
   Не найдено
        </div>
      )}
      </div>
    </div>
  )
}