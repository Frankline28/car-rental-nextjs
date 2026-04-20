'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon, 
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './AdminUsers.module.css';

/* ✅ TYPE */
type UserType = {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
};

export default function AdminUsersPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  /* ✅ AUTH */
  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/auth/login');
      return;
    }
  }, [currentUser, authLoading, router]);

  /* ✅ FETCH */
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await API.users.getAll();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  /* ✅ DELETE */
  const handleDelete = async (id: string | number) => {
    if (!currentUser) return;

    if (String(id) === String(currentUser.id)) {
      alert("Cannot delete currently logged in admin");
      return;
    }

    if (!confirm('Permanently delete this user account?')) return;

    try {
      setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ FILTER SAFE */
  const filteredUsers = users.filter(u => {
    const name = u.name?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return name.includes(query) || email.includes(query);
  });

  /* ✅ LOADING */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin mb-4" />
        <p className="mono-text text-[10px] text-muted uppercase">
          [ SYNCING_OPERATOR_DATA ]
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="scanline" />

      <main className={styles.container}>
        {/* HEADER */}
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

        {/* USERS */}
        <div className={styles.userGrid}>
          {filteredUsers.map((u, i) => {
            const idStr = String(u.id).padStart(6, '0');

            return (
              <motion.div
                key={String(u.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={styles.userCard}
              >
                <div className={styles.cardHeader}>
                  <div className={`${styles.roleIcon} ${u.role === 'admin' ? styles.adminIcon : ''}`}>
                    {u.role === 'admin'
                      ? <Shield className="w-5 h-5" />
                      : <UserIcon className="w-5 h-5" />}
                  </div>

                  <button
                    onClick={() => handleDelete(u.id)}
                    className={styles.deleteBtn}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className={styles.userName}>
                  {u.name || 'Unknown User'}
                </h3>

                <div className={styles.userEmail}>
                  {u.email || 'No Email'}
                </div>

                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Access_Level</span>
                    <span
                      className={styles.detailValue}
                      style={{
                        color: u.role === 'admin' ? 'var(--accent)' : undefined
                      }}
                    >
                      {(u.role || 'user').toUpperCase()}
                    </span>
                  </div>

                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Unique_ID</span>
                    <span className={styles.detailValue}>
                      0x{idStr}
                    </span>
                  </div>
                </div>

                <button className={styles.actionBtn}>
                  [ VIEW_ACCESS_LOGS ]
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* EMPTY */}
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center border border-dashed border-border mt-10">
            <Users className="w-10 h-10 text-muted mx-auto mb-4" />
            <p className="mono-text text-[10px] text-muted uppercase">
              [ NO_MATCHING_IDENTITIES_FOUND ]
            </p>
          </div>
        )}
      </main>
    </div>
  );
}