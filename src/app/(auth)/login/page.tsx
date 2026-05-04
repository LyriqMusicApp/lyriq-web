'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { login } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.replace('/create')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (searchParams.get('expired')) {
      toast.error('Your session expired — please sign in again')
    }
  }, [searchParams])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const res = await login(data.email, data.password)
      setAuth(res.access_token, res.refresh_token, res.user)
      document.cookie = 'lyriq-authed=1; path=/; max-age=2592000'
      const from = searchParams.get('from') ?? '/create'
      router.push(from)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign in failed — please check your email and password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#101828' }}>Welcome back</h1>
        <p className="text-sm mb-8" style={{ color: '#475467' }}>Sign in to your Lyriq account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#101828' }}>Email address</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@school.com"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{ border: `1px solid ${errors.email ? '#EF4444' : '#E4E7EC'}`, background: '#FAFBFC', color: '#101828' }}
              onFocus={e => { if (!errors.email) { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' } }}
              onBlur={e => { if (!errors.email) { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' } }}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: '#101828' }}>Password</label>
              <a href="mailto:lyriqmusicapp@gmail.com?subject=Password%20reset%20request" className="text-xs" style={{ color: '#5B47FB' }}>Forgot password?</a>
            </div>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{ border: `1px solid ${errors.password ? '#EF4444' : '#E4E7EC'}`, background: '#FAFBFC', color: '#101828' }}
              onFocus={e => { if (!errors.password) { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' } }}
              onBlur={e => { if (!errors.password) { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' } }}
            />
            {errors.password && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)', boxShadow: '0 4px 14px rgba(91,71,251,0.25)' }}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: '#475467' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium" style={{ color: '#5B47FB' }}>Register for free</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-80 rounded-2xl animate-pulse" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC' }} />}>
      <LoginForm />
    </Suspense>
  )
}
