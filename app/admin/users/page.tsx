'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon, 
  MapPin, 
  Calendar,
  MoreVertical,
  Trash2,
  Mail,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './AdminUsers.module.css';

export default function AdminUsersPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/auth/login');
      return;
    }

    async function fetchUsers() {
      try {
        const data = await API.users.getAll();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [currentUser, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (id === currentUser.id) {
       alert("Cannot delete currently logged in admin");
       return;
    }
    if (!confirm('Permanently delete this user account?')) return;
    try {
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) return (
     <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin mb-4" />
        <p className="mono-text text-[10px] text-muted uppercase">[ SYNCING_OPERATOR_DATA ]</p>
     </div>
  );

  return (
    <div className={styles.page}>
      <div className="scanline" />
      <main className={styles.container}>
        <header className={styles.header}>
            <div>
              <p className={styles.subtitle}>[ ACCESS_MGMT_v2.0 ]</p>
              <h1 className={styles.title}>Operator_Mesh</h1>
            </div>
            
            <div className={styles.searchWrapper}>
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
               <input 
                  type="text" 
                  placeholder="FILTER_OPERATORS..." 
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
        </header>

        <div className={styles.userGrid}>
           {filteredUsers.map((u, i) => (
             <motion.div 
               key={u.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.03 }}
               className={styles.userCard}
             >
                <div className={styles.cardHeader}>
                   <div className={`${styles.roleIcon} ${u.role === 'admin' ? styles.adminIcon : ''}`}>
                      {u.role === 'admin' ? <Shield className="w-5 h-5"/> : <UserIcon className="w-5 h-5"/>}
                   </div>
                   <button 
                      onClick={() => handleDelete(u.id)}
                      className={styles.deleteBtn}
                   >
                      <Trash2 className="w-4 h-4"/>
                   </button>
                </div>

                <h3 className={styles.userName}>{u.name}</h3>
                <div className={styles.userEmail}>{u.email}</div>

                <div className={styles.detailsList}>
                   <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Access_Level</span>
                      <span className={styles.detailValue} style={{ color: u.role === 'admin' ? 'var(--accent)' : 'inherit' }}>
                        {u.role.toUpperCase()}
                      </span>
                   </div>
                   <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Unique_ID</span>
                      <span className={styles.detailValue}>0x{u.id.padStart(6, '0')}</span>
                   </div>
                </div>

                <button className={styles.actionBtn}>
                   [ VIEW_ACCESS_LOGS ]
                </button>
             </motion.div>
           ))}
        </div>

        {filteredUsers.length === 0 && (
           <div className="py-20 text-center border border-dashed border-border mt-10">
              <Users className="w-10 h-10 text-muted mx-auto mb-4" />
              <p className="mono-text text-[10px] text-muted uppercase">[ NO_MATCHING_IDENTITIES_FOUND ]</p>
           </div>
        )}
      </main>
    </div>
  );
}
