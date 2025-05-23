// Функция для проверки, нужно ли удалить данные (если текущее время >= 19:00)
export function checkAndClearStorage() {
  const now = new Date();
  const hours = now.getHours();
  
  // Если сейчас 19:00 или позже
  if (hours >= 19) {
    const today = now.toDateString();
    const lastClearDate = localStorage.getItem('lastClearDate');
    
    // Если еще не очищали сегодня
    if (lastClearDate !== today) {
      localStorage.removeItem('hourstoday'); // Удаляем вашу переменную
      localStorage.setItem('lastClearDate', today); // Запоминаем дату очистки
    }
  }
}
