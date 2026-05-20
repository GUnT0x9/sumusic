import { BadgeCheck, Download, Headphones, Infinity, Radio, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

const benefits = [
  {
    icon: Headphones,
    title: '광고 없이 음악에만 집중',
    description: '앨범 커버와 사운드만 남기는 조용한 감상 환경을 제공합니다.',
  },
  {
    icon: Download,
    title: '오프라인 저장 준비',
    description: '이동 중에도 끊기지 않도록 저장 기능을 프리미엄에 맞춰 준비 중입니다.',
  },
  {
    icon: Radio,
    title: '더 긴 추천 큐',
    description: '청취 흐름을 분석해 다음 곡을 더 자연스럽게 이어줍니다.',
  },
]

const planItems = ['무손실 스트리밍', '개인화 추천 강화', '우선 업데이트 제공', '프리미엄 배지']

export default function PremiumPage() {
  return (
    <div className="space-y-16 pb-10">
      <section className="relative -mx-4 overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] px-4 py-20 text-center md:-mx-6 md:px-6 lg:py-24">
        <div className="premium-hero-bg" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
          <Logo />
          <h1 className="mt-14 max-w-5xl text-balance text-[44px] font-medium leading-[1.12] tracking-[-0.01em] text-[var(--white)] md:text-[64px]">
            SUMUSIC Premium으로 음악을 더 깊게 즐기세요
          </h1>
          <p className="mt-7 text-base font-medium text-[var(--gray1)] md:text-lg">
            ₩0에 1개월 체험하기 · 이후 ₩11,900/월 · 언제든지 취소 가능
          </p>
          <a
            href="#plans"
            className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--white)] px-7 text-sm font-medium text-[var(--bg)] transition-opacity duration-150 ease-in hover:opacity-85"
          >
            ₩0에 1개월 체험하기
          </a>
          <p className="mt-8 max-w-2xl text-xs font-light text-[var(--gray2)]">
            무료 체험이 종료되기 전에 멤버십 유지 여부를 확인해야 합니다. 확인 전까지 요금이 청구되지 않습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <h2 className="text-balance text-center text-[40px] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--gray1)] md:text-[56px]">
          음악, 추천, 감상 흐름을 간편하게
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <article key={benefit.title} className="surface flex min-h-52 flex-col items-center justify-center p-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-[12px] bg-[var(--bg4)] text-[var(--gray1)]">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 text-base font-medium text-[var(--gray1)]">{benefit.title}</h3>
                <p className="mt-2 text-sm font-light text-[var(--gray2)]">{benefit.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="plans" className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_360px]">
        <div className="surface p-6 md:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[2px] text-[var(--gray2)]">Premium Preview</p>
          <h2 className="display mt-4 text-5xl leading-none text-[var(--gray1)]">SUMUSIC PLUS</h2>
          <p className="mt-4 max-w-2xl text-sm font-light text-[var(--gray2)]">
            지금은 체험 페이지이며 실제 결제는 연결 전입니다. 다음 단계에서 Stripe 또는 Toss Payments로 결제 흐름을 붙일 수 있습니다.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {planItems.map((item) => (
              <div key={item} className="flex min-h-11 items-center gap-3 rounded-[8px] bg-[var(--bg4)] px-3 text-sm text-[var(--gray1)]">
                <BadgeCheck size={15} strokeWidth={1.5} />
                {item}
              </div>
            ))}
          </div>
        </div>
        <aside className="surface p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--bg4)] text-[var(--gray1)]">
              <Sparkles size={20} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--gray1)]">1개월 무료</p>
              <p className="text-xs font-light text-[var(--gray2)]">이후 월 ₩11,900</p>
            </div>
          </div>
          <button className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--white)] px-5 text-sm font-medium text-[var(--bg)] transition-opacity duration-150 ease-in hover:opacity-85" type="button">
            <Infinity size={16} strokeWidth={1.5} />
            프리미엄 시작하기
          </button>
          <p className="mt-4 text-xs font-light text-[var(--gray2)]">결제 연결 전까지는 플랜 미리보기로 동작합니다.</p>
        </aside>
      </section>
    </div>
  )
}
