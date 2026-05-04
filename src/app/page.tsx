import Link from 'next/link'
import { Music } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #EEEBFF 0%, #FAFBFC 60%)' }}>
      <div className="text-center max-w-lg px-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#5B47FB' }}>
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold" style={{ color: '#101828' }}>Lyriq</span>
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: '#101828' }}>
          Educational songs for every classroom
        </h1>
        <p className="text-lg mb-10" style={{ color: '#475467' }}>
          Type a topic. Pick a style. Get a song your class will actually remember.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold text-base transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)', boxShadow: '0 4px 14px rgba(91,71,251,0.35)' }}
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-base border transition-all hover:bg-white"
            style={{ color: '#5B47FB', borderColor: '#5B47FB', background: 'transparent' }}
          >
            Sign in
          </Link>
        </div>

        <p className="text-sm mt-8" style={{ color: '#98A2B3' }}>
          Built for UK primary schools and SEN settings
        </p>
      </div>
    </main>
  )
}
