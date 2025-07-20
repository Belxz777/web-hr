import { host } from "@/types";

export async function getLogs(level: string) {
  try {
    const response = await fetch(`${host}/app/stats/logs?level=${level}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        mode: "no-cors",
      },
    });
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
catch (err) {
        console.error("Ошибка при получении данных:", err);
    }
}