import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'

const MAX_SIZE_MB = 2
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export default function PhotoUpload({ onChange }: { onChange: (file: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    }
  }, [])

  function applyFile(file: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = file ? URL.createObjectURL(file) : null
    setPreview(previewRef.current)
    onChange(file)
  }

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) return
    if (!ACCEPTED.includes(picked.type)) {
      setError('Please choose a JPG, PNG or WEBP image.')
      return
    }
    if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be ${MAX_SIZE_MB} MB or smaller.`)
      return
    }
    setError('')
    applyFile(picked)
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-brown/70">
        Recipe photo (optional)
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-brown/10">
          <img src={preview} alt="Recipe preview" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => applyFile(null)}
            aria-label="Remove photo"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brown shadow transition hover:bg-white"
          >
            <X size={16} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-brown shadow transition hover:bg-white"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brown/20 bg-white/50 text-sm text-brown/70 transition hover:bg-white"
        >
          <ImagePlus size={24} />
          Add a photo
          <span className="text-xs text-brown/50">JPG, PNG or WEBP, up to {MAX_SIZE_MB} MB</span>
        </button>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  )
}