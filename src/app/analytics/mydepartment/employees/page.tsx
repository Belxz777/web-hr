"use client"
import { Employee } from "@/components/admin"
import { Header } from "@/components/ui/header"
import { useState, useEffect, useCallback } from "react"

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("")
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
      const apiUrl = new URL("/api/users/quicksearch", window.location.origin)
      apiUrl.searchParams.append("search", query.trim())
      apiUrl.searchParams.append("only_mydepartment", String(onlyMyDepartment))

      const response = await fetch(apiUrl.toString(), {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Ошибка сервера")
      }

      const data = await response.json()
      setUsers(data.data || data || [])
      console.log(data.data)
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedFetch = useCallback(
    debounce((query: string) => fetchUsers(query), 1500),
    [onlyMyDepartment],
  )

  useEffect(() => {
    debouncedFetch(searchTerm)
  }, [searchTerm, onlyMyDepartment, debouncedFetch])

  return (
    <div className="min-h-screen bg-background">
      <Header showPanel={false} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            
            <h1 className="text-4xl font-bold text-foreground">Поиск сотрудников вашего отдела</h1>
          </div>

          {/* Search Section */}
          <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-xl border border-border p-8">
            <div className="space-y-6">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Введите фамилию сотрудника..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-background border-2 border-input text-foreground rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/20 focus:border-secondary transition-all duration-300 text-lg placeholder-muted-foreground shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Department Filter */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Детали поиска</h3>
                    <p className="text-sm text-muted-foreground">Если ваш уровень доступа выше 3 вы можете найти любого сотрудника</p>
                  </div>
                </div>
              </div>

              {/* Help Tooltip */}
        
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-xl border border-border overflow-hidden">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted/30"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-secondary absolute top-0 left-0"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Поиск сотрудников...</h3>
                <p className="text-muted-foreground">Пожалуйста, подождите</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-8">
                <div className="bg-destructive/10 border-2 border-destructive/20 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-destructive mb-1">Ошибка загрузки</h3>
                      <p className="text-destructive/80">{error}</p>
                      <button
                        onClick={() => fetchUsers(searchTerm)}
                        className="mt-3 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-medium"
                      >
                        Попробовать снова
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && !error && (
              <div className="p-8">
                {users.length > 0 && (
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-secondary rounded-full"></div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Результаты поиска</h2>
                        <p className="text-muted-foreground">
                          Найдено сотрудников: <span className="font-semibold text-secondary">{users.length}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {users.map((employee, index) => (
                    <div
                      key={employee.id|| index}
                      className="group bg-background/80 backdrop-blur-sm border-2 border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-secondary/10 border-2 border-secondary/20 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-secondary font-bold text-lg">
                                {employee.name?.[0]}
                                {employee.surname?.[0]}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary border-2 border-background rounded-full"></div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-foreground">
                              {employee.name} {employee.surname}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-secondary rounded-full"></div>
                              <p className="text-muted-foreground font-medium">Уровень: {employee.position}</p>

                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            window.location.href = `/analytics/history/employee/${employee.id}`
                          }}
                          className="flex items-center space-x-3 px-6 py-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-secondary-foreground border border-secondary/20 hover:border-secondary rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                        >
                          <span>Посмотреть статистику</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {users.length === 0 && searchTerm && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center border border-border">
                      <svg
                        className="w-12 h-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Сотрудники не найдены</h3>
                    <p className="text-muted-foreground text-lg mb-4">
                      По запросу <span className="font-semibold text-secondary">"{searchTerm}"</span> не найдено ни одного
                      сотрудника
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Проверьте правильность написания</p>
                      <p>• Попробуйте ввести только часть фамилии</p>
                      <p>• Убедитесь, что сотрудник работает в вашем отделе</p>
                    </div>
                  </div>
                )}

                {/* Initial State */}
                {users.length === 0 && !searchTerm && (
                  <div className="text-center py-16 select-none">
                    <div className="w-24 h-24 mx-auto mb-6 bg-secondary/10 rounded-full flex items-center justify-center border border-secondary/20">
                      <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Начните поиск</h3>
                    <p className="text-muted-foreground text-lg">Введите фамилию сотрудника в поле поиска выше</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
