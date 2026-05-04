'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  subject: z.string().optional(),
  curriculum_area: z.string().optional(),
  keywords_raw: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  initialTitle: string
  onShare: (data: { title: string; subject?: string; curriculum_area?: string; keywords?: string[] }) => Promise<void>
  onClose: () => void
}

const inputStyle = {
  border: '1px solid #E4E7EC',
  background: '#FAFBFC',
  color: '#101828',
}

export function ShareDialog({ initialTitle, onShare, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: initialTitle },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const keywords = data.keywords_raw
      ? data.keywords_raw.split(',').map(k => k.trim()).filter(Boolean)
      : undefined
    try {
      await onShare({
        title: data.title,
        subject: data.subject || undefined,
        curriculum_area: data.curriculum_area || undefined,
        keywords,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: '#101828' }}>Share to Library</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" style={{ color: '#98A2B3' }} />
          </button>
        </div>

        <p className="text-sm mb-6" style={{ color: '#475467' }}>
          Your song will be visible to all teachers in the Lyriq library.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#101828' }}>Song title</label>
            <input {...register('title')} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ ...inputStyle, border: `1px solid ${errors.title ? '#EF4444' : '#E4E7EC'}` }}
              onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
              onBlur={e => { if (!errors.title) e.target.style.borderColor = '#E4E7EC' }}
            />
            {errors.title && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#101828' }}>Subject</label>
              <input {...register('subject')} placeholder="e.g. Science" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
                onBlur={e => { e.target.style.borderColor = '#E4E7EC' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#101828' }}>Year group</label>
              <input {...register('curriculum_area')} placeholder="e.g. Year 3" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
                onBlur={e => { e.target.style.borderColor = '#E4E7EC' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#101828' }}>Keywords</label>
            <input {...register('keywords_raw')} placeholder="water cycle, evaporation, science" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
              onBlur={e => { e.target.style.borderColor = '#E4E7EC' }}
            />
            <p className="text-xs mt-1" style={{ color: '#98A2B3' }}>Comma-separated — helps other teachers find your song</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ border: '1px solid #E4E7EC', color: '#475467' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)' }}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Sharing…' : 'Share publicly'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
