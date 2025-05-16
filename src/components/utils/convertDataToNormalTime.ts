export const hoursByEveryFunc = (func: { hours: number }) => {
  // Проверка на валидность входных данных
  if (typeof func?.hours !== 'number' || isNaN(func.hours)) {
    return 'Некорректное значение';
  }

  // Обработка отрицательных значений
  if (func.hours < 0) {
    return 'Отрицательное время недопустимо';
  }

  // Если меньше 1 часа, конвертируем в минуты
  if (func.hours < 1) {
    const minutes = (func.hours * 60).toFixed(0);
    return Number(minutes) === 0 ? 'Менее 1 мин' : `${minutes} мин`;
  }

  // Для значений >= 1 часа используем convertDataToNormalTime
  return convertDataToNormalTime(func.hours);
};

// Функция конвертации времени
export const convertDataToNormalTime = (dateHours: number) => {
  const hours = Math.floor(dateHours);
  const minutes = Math.round((dateHours - hours) * 60);

  // Убираем отображение 0 минут, если минут нет
  return minutes === 0 ? `${hours} ч` : `${hours} ч ${minutes} мин`;
};