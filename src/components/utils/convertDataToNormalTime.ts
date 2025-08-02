export const hoursByEveryFunc = (func: { hours: number }) => {
  if (typeof func?.hours !== 'number' || isNaN(func.hours)) {
    return 'Некорректное значение';
  }

  if (func.hours < 0) {
    return 'Отрицательное время недопустимо';
  }

  if (func.hours < 1) {
    const minutes = (func.hours * 60).toFixed(0);
    return Number(minutes) === 0 ? 'Менее 1 мин' : `${minutes} мин`;
  }

  return convertDataToNormalTime(func.hours);
};

export const convertDataToNormalTime = (dateHours: number) => {
  const hours = Math.floor(dateHours);
  const minutes = Math.round((dateHours - hours) * 60);

  return minutes === 0 ? `${hours} ч` : `${hours} ч ${minutes} мин`;

  
}
 export  const formatISODate = (isoString:string) => new Date(isoString).toLocaleTimeString('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short'
}).replace(/\s/g, ' ');


export const formatDatePretty = (dateStr:string) => 
  new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });