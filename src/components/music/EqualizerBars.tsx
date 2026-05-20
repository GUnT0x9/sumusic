export function EqualizerBars() {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className={`eq-bar eq-bar-${item + 1}`}
          style={{
            animationDelay: `${item * 200}ms`
          }}
        />
      ))}
      <style jsx>{`
        .eq-bar {
          width: 3px;
          height: 4px;
          border-radius: 1px;
          background: var(--white);
          animation: eq 0.8s ease-in-out infinite alternate;
        }
        @keyframes eq {
          from {
            height: 4px;
          }
          to {
            height: 14px;
          }
        }
      `}</style>
    </span>
  )
}
