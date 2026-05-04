import { Nav } from '@/components/lyriq/Nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#FAFBFC' }}>
      <Nav />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
