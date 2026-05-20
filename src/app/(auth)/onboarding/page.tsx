import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function OnboardingPage() {
  const tastes = ['R&B', 'Indie', 'K-Pop', 'Alternative', 'Jazz', 'Electronic']

  return (
    <section className="w-full max-w-3xl">
      <Logo />
      <h1 className="display mt-8 text-6xl leading-none text-[var(--gray1)]">취향을 알려주세요</h1>
      <p className="mt-3 text-sm text-[var(--gray2)]">선택한 장르는 홈 추천과 데일리 믹스의 초기 시드로 사용됩니다.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {tastes.map((taste) => (
          <button key={taste} className="surface min-h-20 text-left transition-colors duration-150 ease-in hover:bg-[var(--bg4)]" type="button">
            <span className="display px-4 text-3xl text-[var(--gray1)]">{taste}</span>
          </button>
        ))}
      </div>
      <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-5 text-sm font-medium text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg5)]">완료</Link>
    </section>
  )
}
