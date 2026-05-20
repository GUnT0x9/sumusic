'use client'

import { X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const typeClass = {
  success: 'border-l-[var(--gray1)]',
  error: 'border-l-[var(--gray2)]',
  info: 'border-l-[var(--gray3)]'
}

export function ToastViewport() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed bottom-[136px] left-4 right-4 z-50 flex max-w-[calc(100vw-32px)] flex-col gap-2 md:left-auto md:right-4 md:w-[320px] lg:bottom-24">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between border border-l-2 border-[var(--border)] bg-[var(--bg3)] px-4 py-2.5 text-sm text-[var(--gray1)] ${typeClass[toast.type]}`}
          style={{ borderRadius: 8 }}
        >
          <span>{toast.message}</span>
          <button className="icon-button min-h-9 min-w-9" type="button" aria-label="토스트 닫기" onClick={() => removeToast(toast.id)}>
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  )
}
