'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import styles from '../Auth.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="scanline" />
      <div className={styles.backgroundDecor} style={{ left: '-10%', top: '20%' }}>ENROLL</div>
      <div className={styles.backgroundDecor} style={{ right: '-5%', bottom: '-10%' }}>SYS</div>
      
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Register</h2>
          <p className={styles.subtitle}>[ NEW_OPERATOR_INITIALIZATION ]</p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Identifier (Name)</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="ENTER_NAME..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Comms (Email)</label>
            <input
              type="email"
              required
              className={styles.input}
              placeholder="ENTER_EMAIL..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Pass_Key</label>
            <input
              type="password"
              required
              className={styles.input}
              placeholder="ENTER_PASSWORD..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-cyber w-full flex justify-center py-4 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'INITIALIZE_ACCOUNT'}
          </button>
        </form>

        <div className={styles.footer}>
          ACTIVE_OPERATOR? 
          <Link href="/auth/login" className={styles.link}>
            AUTHENTICATE
          </Link>
        </div>
      </div>
    </div>
  );
}
