'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import styles from '../Auth.module.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ✅ SAFE REDIRECT */
  const redirect = searchParams?.get('redirect') || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('MISSING_CREDENTIALS');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (redirect && redirect !== '/' && redirect !== '/admin/dashboard') {
        router.push(redirect);
      }
    } catch (err) {
      console.error(err);
      const error = err as Error;
      setError(error.message === 'Invalid credentials' ? 'INVALID_CREDENTIALS // ACCESS_DENIED' : 'SYSTEM_ERROR // UPLINK_FAILURE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="scanline" />

      <div className={styles.backgroundDecor} style={{ right: '-5%', top: '10%' }}>
        ACCESS
      </div>
      <div className={styles.backgroundDecor} style={{ left: '-5%', bottom: '-10%' }}>
        PORTAL
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Authorize</h2>
          <p className={styles.subtitle}>[ SYSTEM_ACCESS_PROTOCOL_v4.2 ]</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Identity_Comms (Email)</label>
            <input
              type="email"
              required
              className={styles.input}
              placeholder="ENTER_IDENTITY_KEY..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Security_Token (Password)</label>
            <input
              type="password"
              required
              className={styles.input}
              placeholder="ENTER_PASS_PHRASE..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber w-full flex justify-center py-4 mt-6 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                AUTHENTICATE
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          NEW_IDENTITY?
          <Link href="/auth/register" className={styles.link}>
            INITIALIZE_ACCOUNT
          </Link>
        </div>

        {/* DEMO USERS */}
        <div className="mt-12 grid grid-cols-2 gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="p-4 border border-dashed border-border bg-surface-accent">
            <p className="mono-text text-[8px] text-muted mb-1">
              ADMIN_AUTO_AUTH
            </p>
            <p className="mono-text text-[9px] text-primary">
              admin@carrental.com / admin
            </p>
          </div>

          <div className="p-4 border border-dashed border-border bg-surface-accent">
            <p className="mono-text text-[8px] text-muted mb-1">
              CLIENT_AUTO_AUTH
            </p>
            <p className="mono-text text-[9px] text-primary">
              jane@example.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}