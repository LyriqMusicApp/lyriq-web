import Link from 'next/link'
import { Music } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      <header className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#5B47FB' }}>
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: '#101828' }}>Lyriq</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
