'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import type { GenerateSongRequest } from '@/types'

const schema = z.object({
  topic: z.string().min(5, 'Please describe your topic (at least 5 characters)').max(1000, 'Topic is too long — keep it under 1000 characters'),
  age_range: z.enum(['3-5', '6-9', '10-13']),
  genre: z.enum(['pop', 'rap', 'chant', 'rock', 'country', 'lullaby', 'folk']),
  tone: z.enum(['calm', 'happy', 'encouraging', 'energetic', 'silly', 'peaceful']),
  subject: z.string().optional(),
  curriculum_area: z.string().optional(),
  keywords_raw: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onGenerate: (data: GenerateSongRequest) => void
  isLoading: boolean
  defaultValues?: Partial<FormData>
}

const selectStyle = {
  border: '1px solid #E4E7EC',
  background: '#FAFBFC',
  color: '#101828',
  cursor: 'pointer',
}

const options = {
  age_range: [
    { value: '3-5', label: 'Early Years (3–5)' },
    { value: '6-9', label: 'KS1 (6–9)' },
    { value: '10-13', label: 'KS2 (10–13)' },
  ],
  genre: [
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'rap', label: 'Rap' },
    { value: 'country', label: 'Country' },
    { value: 'folk', label: 'Folk' },
    { value: 'chant', label: 'Chant' },
    { value: 'lullaby', label: 'Lullaby' },
  ],
  tone: [
    { value: 'happy', label: 'Happy' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'calm', label: 'Calm' },
    { value: 'encouraging', label: 'Encouraging' },
    { value: 'silly', label: 'Silly' },
    { value: 'peaceful', label: 'Peaceful' },
  ],
}

export function GenerateForm({ onGenerate, isLoading, defaultValues }: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      age_range: '6-9',
      genre: 'pop',
      tone: 'happy',
      ...defaultValues,
    },
  })

  const topicValue = watch('topic') ?? ''

  const onSubmit = (data: FormData) => {
    const keywords = data.keywords_raw
      ? data.keywords_raw.split(',').map(k => k.trim()).filter(Boolean)
      : undefined

    onGenerate({
      topic: data.topic,
      age_range: data.age_range,
      genre: data.genre,
      tone: data.tone,
      language: 'en',
      subject: data.subject || undefined,
      curriculum_area: data.curriculum_area || undefined,
      keywords,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Topic */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#101828' }}>
          What&apos;s the song about?
        </label>
        <div className="relative">
          <textarea
            {...register('topic')}
            rows={4}
            disabled={isLoading}
            placeholder="e.g. A song about the water cycle for Year 3. Include evaporation and condensation. Keep it fun and memorable."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none leading-relaxed disabled:opacity-50"
            style={{
              border: `1px solid ${errors.topic ? '#EF4444' : '#E4E7EC'}`,
              background: '#FFFFFF',
              color: '#101828',
            }}
            onFocus={e => {
              if (!errors.topic) { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' }
            }}
            onBlur={e => {
              if (!errors.topic) { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' }
            }}
          />
          <span className="absolute bottom-3 right-3 text-xs" style={{ color: topicValue.length > 900 ? '#EF4444' : '#98A2B3' }}>
            {topicValue.length}/1000
          </span>
        </div>
        {errors.topic && <p className="text-xs mt-1.5" style={{ color: '#EF4444' }}>{errors.topic.message}</p>}
      </div>

      {/* Three dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#101828' }}>Age range</label>
          <select
            {...register('age_range')}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
            style={selectStyle}
            onFocus={e => { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' }}
          >
            {options.age_range.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#101828' }}>Genre</label>
          <select
            {...register('genre')}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
            style={selectStyle}
            onFocus={e => { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' }}
          >
            {options.genre.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#101828' }}>Tone</label>
          <select
            {...register('tone')}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
            style={selectStyle}
            onFocus={e => { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' }}
          >
            {options.tone.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Advanced options */}
      <div>
        <button
          type="button"
          onClick={() => setAdvancedOpen(o => !o)}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: '#5B47FB' }}
        >
          {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Advanced options
        </button>

        {advancedOpen && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4" style={{ borderTop: '1px solid #E4E7EC' }}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#475467' }}>Subject</label>
              <input
                {...register('subject')}
                disabled={isLoading}
                placeholder="e.g. Science"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
                style={{ border: '1px solid #E4E7EC', background: '#FAFBFC', color: '#101828' }}
                onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
                onBlur={e => { e.target.style.borderColor = '#E4E7EC' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#475467' }}>Year group</label>
              <input
                {...register('curriculum_area')}
                disabled={isLoading}
                placeholder="e.g. Year 3"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
                style={{ border: '1px solid #E4E7EC', background: '#FAFBFC', color: '#101828' }}
                onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
                onBlur={e => { e.target.style.borderColor = '#E4E7EC' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#475467' }}>Keywords</label>
              <input
                {...register('keywords_raw')}
                disabled={isLoading}
                placeholder="comma, separated"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
                style={{ border: '1px solid #E4E7EC', background: '#FAFBFC', color: '#101828' }}
                onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
                onBlur={e => { e.target.style.borderColor = '#E4E7EC' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)',
          boxShadow: '0 4px 20px rgba(91,71,251,0.35)',
        }}
      >
        <Sparkles className="w-5 h-5" />
        Generate song
      </button>
    </form>
  )
}
