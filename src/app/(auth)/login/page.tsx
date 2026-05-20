'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login, getAuthErrorMessage } from '@/lib/authClient';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      const nextPath = new URLSearchParams(window.location.search).get('next');
      router.push(nextPath ?? '/');
      router.refresh();
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="surface w-full max-w-md p-6">
      <Logo />
      <h1 className="display mt-8 text-5xl text-[var(--gray1)]">로그인</h1>
      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <label className="block text-sm text-[var(--gray2)]">
          이메일
          <input
            className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-3 text-[var(--gray1)] outline-none"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label className="block text-sm text-[var(--gray2)]">
          비밀번호
          <input
            className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-3 text-[var(--gray1)] outline-none"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="text-sm text-[var(--gray2)]">{error}</p> : null}
        <button
          className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] text-sm font-medium text-[
        var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg5)] disabled:cursor-not-allowed disabled:text-[var(--gray2)]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p className="mt-4 text-sm text-[var(--gray2)]">
        계정이 없다면{' '}
        <Link className="text-[var(--gray1)]" href="/register">
          회원가입
        </Link>
      </p>
    </section>
  );
}
