'use client'

import { useParams, useRouter } from 'next/navigation'
import { CheckCircle2, LogIn, XCircle } from 'lucide-react'
import { useState } from 'react'
import { acceptTeamInvite, getTeamErrorMessage } from '@/lib/teamClient'
import { useUIStore } from '@/store/uiStore'

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()
  const { addToast } = useUIStore()
  const [status, setStatus] = useState<'idle' | 'accepted' | 'failed'>('idle')
  const [busy, setBusy] = useState(false)

  const handleAccept = async () => {
    setBusy(true)
    try {
      await acceptTeamInvite(params.token)
      setStatus('accepted')
      addToast('팀 초대를 수락했어요', 'success')
    } catch (error) {
      setStatus('failed')
      addToast(getTeamErrorMessage(error), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-5 py-10">
      <section className="surface w-full max-w-md p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[var(--bg4)] text-[var(--gray1)]">
          {status === 'failed' ? <XCircle size={22} strokeWidth={1.5} /> : <CheckCircle2 size={22} strokeWidth={1.5} />}
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-[var(--gray1)]">팀 초대</h1>
        <p className="mt-2 text-sm text-[var(--gray2)]">
          {status === 'accepted'
            ? '초대 수락이 완료됐어요. 설정에서 참여한 팀을 확인할 수 있습니다.'
            : status === 'failed'
              ? '초대를 수락하지 못했어요. 초대받은 이메일 계정으로 로그인했는지 확인해주세요.'
              : '로그인한 계정으로 이 팀 초대를 수락합니다.'}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] px-4 text-sm text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)] disabled:opacity-50"
            type="button"
            onClick={handleAccept}
            disabled={busy || status === 'accepted'}
          >
            <CheckCircle2 size={15} strokeWidth={1.5} />
            초대 수락
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] px-4 text-sm text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)]"
            type="button"
            onClick={() => router.push('/login')}
          >
            <LogIn size={15} strokeWidth={1.5} />
            로그인
          </button>
        </div>
      </section>
    </main>
  )
}
