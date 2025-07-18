'use client'

import UniversalFooter from '@/components/buildIn/UniversalFooter'
import { Header } from '@/components/ui/header'


import { Employee } from '@/types'
import { useState, useEffect, useCallback } from 'react'

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyMyDepartment, setOnlyMyDepartment] = useState(true)
  const [users, setUsers] = useState<Employee[]>([])
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
    // Формируем URL для нашего API роута
    const apiUrl = new URL('/api/users/quicksearch', window.location.origin)
    apiUrl.searchParams.append('search', query.trim())
    apiUrl.searchParams.append('only_mydepartment', String(onlyMyDepartment))


    const response = await fetch(apiUrl.toString(), {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || 'Ошибка сервера')
    }

    const data = await response.json()
    setUsers(data.users || data || [])
  } catch (err) {
    console.error('Search error:', err)
    setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
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
  <div className="max-w-4xl mx-auto">
     <Header showPanel={false} />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
        
          Поиск сотрудников вашего отдела
        </h1>
        <p className="text-muted-foreground">Найдите сотрудников своего отдела и посмотрите статистику </p>
      </div>

      {/* Search Card */}
      <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border mb-6">
        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            
            </div>
            <input
              type="text"
              placeholder="Поиск по фамилии..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-background border-2 border-input text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-lg placeholder-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted/30"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary absolute top-0 left-0"></div>
            </div>
            <p className="text-muted-foreground font-medium">Поиск сотрудников...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-red-500 text-xl">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">Ошибка загрузки</h3>
                  <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="p-6">
            {users.length > 0 && (
              <div className="mb-4">
                <p className="text-muted-foreground">
                  Найдено сотрудников: <span className="font-semibold text-foreground">{users.length}</span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              {users.map((employee, index) => (
                <div
                  key={employee.employeeId || index}
                  className="group bg-background/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
              
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-muted-foreground">Уровень доступа {employee.position}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        window.location.href = `/analytics/mydepartment/employees/${employee.employeeId}`
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary rounded-xl font-medium transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Посмотреть
                     
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {users.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Сотрудники не найдены</h3>
                <p className="text-muted-foreground">По запросу "{searchTerm}" не найдено ни одного сотрудника</p>
              </div>
            )}

            {/* Initial State */}
            {users.length === 0 && !searchTerm && (
              <div className="text-center py-12  select-none" >
                <div className="text-6xl mb-4 ">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Начните поиск</h3>
                <p className="text-muted-foreground">Введите фамилию сотрудника для поиска</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}