'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import type { Booking } from '@/lib/api';
import { 
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MyBookings.module.css';

export default function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) return;

    async function fetchBookings() {
      if (!user) return;
      try {
        const data = await API.bookings.getByUser(user.id);
        // Sort by timestamp descending
        data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [user, authLoading]);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.bookings.update(id, { status: 'cancelled' });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert('Cancellation failed');
    }
  };

  if (authLoading || (loading && !user)) return (
     <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="mono-text text-[10px] text-muted animate-pulse">[ ACCESSING_PERSONAL_LEDGER ]</p>
        </div>
     </div>
  );

  return (
    <div className={styles.page}>
      <div className="scanline" />
      <main className={styles.container}>
        <header className={styles.header}>
            <div>
              <p className={styles.subtitle}>[ AUTHENTICATED_OPERATOR_v4 ]</p>
              <h1 className={styles.title}>Asset_Ledger</h1>
            </div>
            
            <div className="flex items-end gap-12">
               <div className="text-right">
                  <p className="mono-text text-[9px] text-muted mb-1">OPERATOR_ID</p>
                  <p className="mono-text text-xs font-black text-primary">{user?.name.toUpperCase().replace(' ', '_')}</p>
               </div>
               <div className="text-right">
                  <p className="mono-text text-[9px] text-muted mb-1">NETWORK_CREDITS</p>
                  <p className="mono-text text-xl font-black text-accent">1,250</p>
               </div>
            </div>
        </header>

        <div className={styles.bookingList}>
            <AnimatePresence mode="popLayout">
               {loading ? (
                 [1, 2].map(i => <div key={i} className="h-96 border border-border bg-surface animate-pulse" />)
               ) : bookings.length === 0 ? (
                 <div className="text-center py-32 border border-dashed border-border">
                    <div className="w-20 h-20 border border-border flex items-center justify-center mx-auto mb-8">
                       <div className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-2xl font-black text-primary mb-3 uppercase tracking-tighter">No_Active_Assignments</h3>
                    <p className="mono-text text-xs text-muted max-w-sm mx-auto leading-relaxed uppercase">
                      YOUR PERSONAL LEDGER IS CURRENTLY CLEAR. INITIATE NEW MISSION BY BROWSING AVAILABLE ASSETS.
                    </p>
                    <Link href="/cars" className="mt-12 inline-block btn-cyber btn-cyber-active px-10">Scan_Fleet</Link>
                 </div>
               ) : (
                 bookings.map((booking, i) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={booking.id} 
                      className={styles.bookingCard}
                    >
                        <div className={styles.assetPanel}>
                           <div className="relative w-full h-full">
                              <Image 
                                 src={booking.carImage ? (booking.carImage.startsWith('http') ? booking.carImage : `/${booking.carImage}`) : '/placeholder-car.jpg'}
                                 alt={booking.carName}
                                 fill
                                 className="object-cover"
                              />
                           </div>
                           <div className="absolute top-6 left-6 mono-text text-[9px] text-white bg-black/50 px-3 py-1 backdrop-blur-sm">
                              ASSET_VISUAL_0{i+1}
                           </div>
                        </div>
                       
                       <div className={styles.detailsPanel}>
                          <div className={styles.metaRow}>
                             <div className="flex gap-4">
                                <span className={`${styles.statusBadge} ${booking.status === 'confirmed' ? styles.statusConfirmed : styles.statusCancelled}`}>
                                   {booking.status}
                                </span>
                                <span className="mono-text text-[9px] text-muted border border-border px-3 py-1">TRANSACTION_#{booking.id.padStart(5, '0')}</span>
                             </div>
                             <div className="mono-text text-[9px] text-accent">SECURE_SYNC_OK</div>
                          </div>

                          <h3 className={styles.assetTitle}>{booking.carName}</h3>
                          <div className={styles.infoLine}>[ {booking.packageName.toUpperCase()} ] {"//"} {"ASSIGNED_TO_OPERATOR"}</div>
                          
                          <div className={styles.specGrid}>
                             <div className={styles.specItem}>
                                <span className={styles.specLabel}>Deployment_Node</span>
                                <span className={styles.specValue}>DOWNTOWN_HUB_A</span>
                             </div>
                             <div className={styles.specItem}>
                                <span className={styles.specLabel}>Schedule_Start</span>
                                <span className={styles.specValue}>
                                   {new Date(booking.date).toLocaleDateString()} {"//"} {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                          </div>

                          <div className={styles.footerRow}>
                             <div className="flex items-center gap-3 mono-text text-[9px] text-accent uppercase font-black">
                                <ShieldCheck className="w-4 h-4" />
                                Comprehensive_Array_Active
                             </div>
                             
                             <div className="flex items-center gap-8">
                                <div className="text-right">
                                   <p className="mono-text text-[8px] text-muted mb-1">DEBITED_TOTAL</p>
                                   <p className={styles.price}>₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                                {booking.status === 'confirmed' && (
                                   <button 
                                      onClick={() => handleCancel(booking.id)}
                                      className="btn-cyber text-[8px] py-4"
                                      style={{ color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.2)' }}
                                   >
                                      Terminate_Contract
                                   </button>
                                )}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 ))
               )}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
