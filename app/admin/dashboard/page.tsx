'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import { 
  TrendingUp, 
  Users, 
  Car, 
  Briefcase, 
  ChevronRight, 
  ArrowUpRight, 
  IndianRupee, 
  Calendar,
  ShieldCheck,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

/* ================= TYPES ================= */

type Booking = {
  id: string | number;
  carName?: string;
  packageName?: string;
  totalAmount?: number;
  status?: string;
};

type Stats = {
  bookings: number;
  revenue: number;
  cars: number;
  users: number;
};

/* ================= COMPONENT ================= */

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    bookings: 0,
    revenue: 0,
    cars: 0,
    users: 0
  });

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔐 Auth protection
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
      return;
    }

    async function fetchData() {
      try {
        const [bookingsData, carsData, usersData] = await Promise.all([
          API.bookings.getAll(),
          API.cars.getAll(),
          API.users.getAll()
        ]);

        // ✅ Ensure arrays
        const bookings: Booking[] = Array.isArray(bookingsData) ? bookingsData : [];
        const cars = Array.isArray(carsData) ? carsData : [];
        const users = Array.isArray(usersData) ? usersData : [];

        // ✅ Revenue calculation (safe)
        const revenue = bookings.reduce(
          (acc, cur) => acc + (cur.totalAmount || 0),
          0
        );

        setStats({
          bookings: bookings.length,
          revenue,
          cars: cars.length,
          users: users.length
        });

        setRecentBookings(bookings.slice(-5).reverse());

      } catch (err) {
        console.error('Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, authLoading, router]);

  /* ================= LOADING ================= */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="mono-text text-[10px] text-muted animate-pulse">
            [ LOADING_EXECUTIVE_LEDGER ]
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  const statCards = [
    { label: "NET_REVENUE", value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, trend: "+12.5%" },
    { label: "TOTAL_BOOKINGS", value: stats.bookings, icon: Briefcase, trend: "+8.2%" },
    { label: "ASSET_COUNT", value: stats.cars, icon: Car, trend: "STABLE" },
    { label: "OPERATOR_BASE", value: stats.users, icon: Users, trend: "+15.3%" },
  ];

  return (
    <div className={styles.page}>
      <div className="scanline" />

      <main className={styles.container}>

        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>[ SYSTEM_AUTHORITY_LEVEL_01 ]</p>
            <h1 className={styles.title}>Executive_Dashboard</h1>
          </div>

          <div className="flex gap-4">
            <Link href="/admin/fleet" className="btn-cyber btn-cyber-active">
              Manage_Fleet
            </Link>
            <Link href="/admin/users" className="btn-cyber">
              User_Network
            </Link>
          </div>
        </header>

        {/* STATS */}
        <div className={styles.statsGrid}>
          {statCards.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={styles.statCard}
            >
              <div className="flex justify-between items-start mb-6">
                <stat.icon className="w-6 h-6 text-accent" />
                <div className="mono-text text-[9px] text-accent flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {stat.trend}
                </div>
              </div>

              <p className={styles.statLabel}>{stat.label}</p>
              <h3 className={styles.statValue}>{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* CONTENT */}
        <div className={styles.contentGrid}>

          {/* BOOKINGS TABLE */}
          <div className={styles.section}>
            <div className="flex justify-between items-end border-b border-border pb-4">
              <h3 className={styles.sectionTitle}>TRANSACTION_LEDGER</h3>
            </div>

            <div className="ledger-card overflow-hidden">
              <table className={styles.ledgerTable}>
                <thead className={styles.ledgerHeader}>
                  <tr>
                    <th>ID</th>
                    <th>CAR</th>
                    <th>PACKAGE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={String(booking.id)} className={styles.ledgerRow}>

                      <td>
                        #{String(booking.id).padStart(4, '0')}
                      </td>

                      <td>
                        {booking.carName?.split(' ')?.[1] || booking.carName || 'N/A'}
                      </td>

                      <td>
                        {booking.packageName?.toUpperCase?.() || 'N/A'}
                      </td>

                      <td>
                        ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      <td>
                        <span className={
                          booking.status === 'confirmed'
                            ? styles.statusCompleted
                            : styles.statusPending
                        }>
                          {booking.status || 'pending'}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

              {recentBookings.length === 0 && (
                <div className="py-20 text-center mono-text text-[10px] text-muted">
                  [ DATABASE_EMPTY ]
                </div>
              )}
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-8">

            <div className="ledger-card p-8">
              <h3 className={styles.sectionTitle}>QUICK_ACTIONS</h3>

              <div className="space-y-3 mt-6">
                <button className="btn-cyber w-full flex justify-between">
                  <Package /> Update Fees
                </button>
                <button className="btn-cyber w-full flex justify-between">
                  <Calendar /> Export Reports
                </button>
                <button className="btn-cyber w-full flex justify-between">
                  <ShieldCheck /> Security Sync
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}