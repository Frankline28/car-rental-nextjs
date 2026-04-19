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

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    bookings: 0,
    revenue: 0,
    cars: 0,
    users: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
      return;
    }

    async function fetchData() {
      try {
        const [bookings, cars, users] = await Promise.all([
          API.bookings.getAll(),
          API.cars.getAll(),
          API.users.getAll()
        ]);

        const revenue = bookings.reduce((acc, curr) => acc + (curr.status === 'confirmed' ? curr.totalAmount : 0), 0);
        
        setStats({
          bookings: bookings.length,
          revenue,
          cars: cars.length,
          users: users.length
        });

        setRecentBookings(bookings.slice(-5).reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return (
     <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="mono-text text-[10px] text-muted animate-pulse">[ LOADING_EXECUTIVE_LEDGER ]</p>
        </div>
     </div>
  );

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

        {/* Stats Grid */}
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
                   <div className="text-accent">
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <div className="mono-text text-[9px] text-accent flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.trend}
                   </div>
                </div>
                <p className={styles.statLabel}>{stat.label}</p>
                <h3 className={styles.statValue}>{stat.value}</h3>
             </motion.div>
           ))}
        </div>

        <div className={styles.contentGrid}>
           {/* Recent Bookings */}
           <div className={styles.section}>
              <div className="flex justify-between items-end border-b border-border pb-4">
                 <h3 className={styles.sectionTitle}>TRANSACTION_LEDGER</h3>
                 <button className="mono-text text-[9px] text-muted hover:text-accent">FULL_SYNC {">"}</button>
              </div>
              <div className="ledger-card overflow-hidden">
                <table className={styles.ledgerTable}>
                  <thead className={styles.ledgerHeader}>
                    <tr>
                      <th>IDENTIFIER</th>
                      <th>ASSET</th>
                      <th>PACKAGE</th>
                      <th>GROSS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className={styles.ledgerRow}>
                        <td>
                          <div className="flex items-center gap-4">
                            <span className="mono-text text-[10px] text-accent">#{booking.id.toString().padStart(4, '0')}</span>
                          </div>
                        </td>
                        <td>
                          <span className="mono-text text-[10px]">{booking.carName.split(' ')[1]}</span>
                        </td>
                        <td>
                          <span className="mono-text text-[9px] text-muted">{booking.packageName.toUpperCase()}</span>
                        </td>
                        <td>
                          <span className="mono-text text-[10px] font-black">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${booking.status === 'confirmed' ? styles.statusCompleted : styles.statusPending}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentBookings.length === 0 && (
                  <div className="py-20 text-center mono-text text-[10px] text-muted">[ DATABASE_EMPTY ]</div>
                )}
              </div>
           </div>

           {/* Quick Actions / System Status */}
           <div className="space-y-8">
              <div className="ledger-card p-8 bg-surface-accent">
                 <h3 className={styles.sectionTitle} style={{ marginBottom: '2rem' }}>QUICK_PROTOCOLS</h3>
                 <div className="grid grid-cols-1 gap-3">
                    {[
                      { icon: Package, label: "UPDATE_NET_FEES" },
                      { icon: Calendar, label: "EXPORT_REPORTS" },
                      { icon: ShieldCheck, label: "SECURITY_SYNC" },
                    ].map((action, i) => (
                      <button key={i} className="btn-cyber w-full flex justify-between items-center px-6">
                         <span className="flex items-center gap-4">
                            <action.icon className="w-4 h-4" /> {action.label}
                         </span>
                         <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                 </div>
              </div>

              <div className="ledger-card p-10 bg-accent text-background relative overflow-hidden group">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-2 h-2 rounded-full bg-background animate-pulse" />
                    <span className="mono-text text-[9px] font-black uppercase">Core_Integrity</span>
                 </div>
                 <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">System_Nominal</h4>
                 <p className="mono-text text-[9px] font-bold leading-relaxed mb-8 uppercase">Direct uplinks to all regional nodes verified. SSL certificates active.</p>
                 <div className="flex items-center gap-3 mono-text text-[9px] font-black uppercase cursor-pointer hover:gap-5 transition-all">
                    Detail_Metrics <ArrowUpRight className="w-4 h-4" />
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
