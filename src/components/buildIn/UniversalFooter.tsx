import Link from "next/link";

export default function UniversalFooter() {
  return (
    <footer className="mt-8 text-center text-gray-400 pb-4">
      <p>©  2025 Рабочий Пульс Все права защищены.</p>
      <Link href='/settings' className=' no-underline hover:underline' prefetch={false}>Возникли проблемы с приложением? </Link>
    </footer>
  )
}