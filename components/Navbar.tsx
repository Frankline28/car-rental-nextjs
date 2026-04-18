'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Car, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Index', href: '/' },
    { name: 'Fleet', href: '/cars' },
    { name: 'Protocol', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.statusIndicator} />
          <span className={styles.logoText}>
            LUXE<span className={styles.logoAccent}>DRIVE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.links}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={styles.link}
            >
              {link.name}
            </Link>
          ))}
          
          <div className={styles.actions}>
            {user ? (
              <div className="flex items-center gap-6">
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className={styles.link}>
                    [Admin_Access]
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link href="/dashboard/my-bookings" className={styles.link}>
                    [Itinerary]
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className={styles.link}
                  style={{ color: '#ff4444', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Terminate
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/auth/login" className={styles.link}>
                  Login
                </Link>
                <Link href="/auth/register" className="btn-cyber btn-cyber-active" style={{ padding: '0.5rem 1rem' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-border bg-black/95 p-8 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={styles.link}
                style={{ fontSize: '1rem' }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button onClick={logout} className={styles.link} style={{ color: '#ff4444', textAlign: 'left' }}>Terminate Session</button>
            ) : (
              <Link href="/auth/login" className="btn-cyber text-center" onClick={() => setIsOpen(false)}>Login</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
