import Link from "next/link";

export default function UniversalFooter() {
  return (
    <footer className="footerAuthStyles pb-4">
      <p>{`© ${new Date().getFullYear()} HR-эффективность `}</p>
      <Link href='/settings' className=' no-underline hover:underline' prefetch={false}>Возникли проблемы с приложением? </Link>
    </footer>
  )
}