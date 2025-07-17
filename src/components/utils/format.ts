  export const formatTime = (hoursDecimal: number) => {
    const totalMinutes = Math.round(hoursDecimal * 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours} ч ${minutes} мин`
  }

  export const formatReportDate = (date: Date) => {
    const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
    const dayName = daysOfWeek[date.getDay()]
    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    return `${formattedDate}, ${dayName}`
  }

  export const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${day}.${month}.${year}`
  }
