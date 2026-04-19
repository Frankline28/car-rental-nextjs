'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { Search, ChevronRight, Star, Shield, Filter } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Cars.module.css';

export default function FleetPage() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchCars() {
      try {
        const data = await API.cars.getAll();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car => {
      const matchesSearch = car.make.toLowerCase().includes(search.toLowerCase()) || 
                          car.model.toLowerCase().includes(search.toLowerCase());
      const matchesType = filter === 'All' || car.type === filter;
      return matchesSearch && matchesType;
    });
    setFilteredCars(filtered);
  }, [search, filter, cars]);

  const categories = ['All', 'Luxury', 'SUV', 'Sport', 'Coupe'];

  return (
    <div className={styles.page}>
      <div className="scanline" />
      <div className={styles.container}>
        {/* Sidebar Controls */}
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <p className="mono-text text-accent mb-4">[ ACCESS_PORTAL ]</p>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search_Registry..." 
                className="w-full bg-surface border border-border p-4 mono-text text-[10px] outline-none focus:border-accent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Category_Node</h4>
            <div className={styles.categoryGrid}>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`${styles.categoryButton} ${filter === cat ? styles.categoryButtonActive : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 border border-border bg-surface-accent">
            <p className="mono-text text-[9px] text-muted mb-4">STATUS: SYSTEM_NOMINAL</p>
            <p className="mono-text text-[9px] text-muted mb-4">UPLINK: ACTIVE_ENCRYPTED</p>
            <div className="w-full h-1 bg-border relative overflow-hidden">
               <div className="absolute inset-0 bg-accent w-1/3 animate-pulse" />
            </div>
          </div>
        </aside>

        {/* Content Engine */}
        <main className={styles.content}>
          <header className={styles.header}>
            <div>
              <p className="mono-text text-accent mb-2">[ DATA_STREAM ]</p>
              <h1 className={styles.title}>Asset_Inventory</h1>
            </div>
            <div className={styles.resultsCount}>
              COUNT :: {filteredCars.length} // ASSETS_IDENTIFIED
            </div>
          </header>

          <div className={styles.grid}>
            {loading ? (
              [1, 2, 4, 5, 6].map(i => <div key={i} className="h-96 ledger-card animate-pulse border border-border" />)
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredCars.map((car, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    key={car.id}
                  >
                    <Link href={`/cars/${car.id}`} style={{ textDecoration: 'none' }}>
                      <div className="ledger-card h-full flex flex-col group">
                        <div className="relative h-56 overflow-hidden border-b border-border">
                          <img 
                            src={car.image.startsWith('http') ? car.image : `/${car.image}`} 
                            alt={car.model} 
                            className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="absolute bottom-0 left-0 bg-accent text-background px-4 py-1 mono-text text-[10px] font-black">
                            {car.type.toUpperCase()}_SPEC
                          </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <h3 className="text-2xl font-black text-primary mb-1 uppercase tracking-tighter">{car.make} <span className="text-accent">{car.model}</span></h3>
                                 <p className="mono-text text-[10px] text-muted">{car.year} // TRANSMISSION::{car.transmission}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-2xl font-black text-primary">₹{car.pricePerDay}</p>
                                 <p className="mono-text text-[9px] text-muted">Per_Cycle</p>
                              </div>
                           </div>
                           
                           <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                              <div className="flex gap-6">
                                <div className="mono-text text-[10px] text-muted flex items-center gap-2">
                                   <Star className="w-3.5 h-3.5 text-accent" /> 4.9
                                </div>
                                <div className="mono-text text-[10px] text-muted flex items-center gap-2">
                                   <Shield className="w-3.5 h-3.5 text-accent" /> AUTHENTICATED
                                </div>
                              </div>
                              <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-background transition-all">
                                <ChevronRight className="w-5 h-5" />
                              </div>
                           </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {!loading && filteredCars.length === 0 && (
              <div className="col-span-full py-32 text-center border border-dashed border-border">
                  <h3 className="text-2xl font-black text-primary mb-3 uppercase tracking-tighter">No_Matching_Assets</h3>
                  <p className="mono-text text-[10px] text-muted max-w-sm mx-auto uppercase">Try adjusting your filters or contact the regional hub for manual procurement.</p>
                  <button onClick={() => {setFilter('All'); setSearch('');}} className="mt-8 mono-text text-accent font-black text-xs uppercase hover:underline">Reset_All_Filters</button>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
