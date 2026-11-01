import { useEffect, type ReactNode } from 'react'

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brown/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto w-full max-w-md rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-brown/10 backdrop-blur-md sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-brown">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-full px-2 text-2xl leading-none text-brown/70 transition hover:bg-brown/5 hover:text-brown">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}