'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { register as registerUser } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  display_name: z.string().min(2, 'Please enter your name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  school_code: z.string().min(3, 'Please enter your school code'),
  country: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#101828' }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  )
}

const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
const inputStyle = (hasError: boolean) => ({
  border: `1px solid ${hasError ? '#EF4444' : '#E4E7EC'}`,
  background: '#FAFBFC',
  color: '#101828',
})

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'GB' },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const { confirm_password: _, ...payload } = data
      const res = await registerUser({ ...payload, school_code: payload.school_code.toUpperCase() })
      setAuth(res.access_token, res.refresh_token, res.user)
      document.cookie = 'lyriq-authed=1; path=/; max-age=2592000'
      router.push('/create')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#101828' }}>Create your account</h1>
        <p className="text-sm mb-8" style={{ color: '#475467' }}>Enter your school code to get started</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="Your name" error={errors.display_name?.message}>
            <input {...register('display_name')} className={inputClass} style={inputStyle(!!errors.display_name)} placeholder="Ms Smith" />
          </Field>

          <Field label="Email address" error={errors.email?.message}>
            <input {...register('email')} type="email" autoComplete="email" className={inputClass} style={inputStyle(!!errors.email)} placeholder="you@school.com" />
          </Field>

          <Field label="Password" error={errors.password?.message}>
            <input {...register('password')} type="password" autoComplete="new-password" className={inputClass} style={inputStyle(!!errors.password)} placeholder="At least 8 characters" />
          </Field>

          <Field label="Confirm password" error={errors.confirm_password?.message}>
            <input {...register('confirm_password')} type="password" autoComplete="new-password" className={inputClass} style={inputStyle(!!errors.confirm_password)} placeholder="••••••••" />
          </Field>

          <Field label="School code" error={errors.school_code?.message}>
            <input
              {...register('school_code')}
              className={inputClass}
              style={inputStyle(!!errors.school_code)}
              placeholder="e.g. STJOHNS-2024"
              autoCapitalize="characters"
            />
            <p className="text-xs mt-1" style={{ color: '#98A2B3' }}>Ask your school administrator for your code</p>
          </Field>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 mt-2"
            style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)', boxShadow: '0 4px 14px rgba(91,71,251,0.25)' }}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: '#475467' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: '#5B47FB' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
