export function checkAndClearStorage() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 19) {
    const today = now.toDateString();
    const lastClearDate = localStorage.getItem("lastClearDate");

    if (lastClearDate !== today) {
      localStorage.removeItem("hourstoday");
      localStorage.setItem("lastClearDate", today);
    }
  }
}
