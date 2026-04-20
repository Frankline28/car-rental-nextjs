'use client';

import { useState, useEffect } from 'react';
import { API, Car } from '@/lib/api';
import { Search, ChevronRight, Star, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Cars.module.css';

/* ================= TYPES ================= */

// Removed local Car type as it is imported from @/lib/api

/* ================= COMPONENT ================= */

export default function FleetPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  /* ================= FETCH ================= */

  useEffect(() => {
    async function fetchCars() {
      try {
        const data = await API.cars.getAll();

        const safeData: Car[] = Array.isArray(data) ? data : [];

        setCars(safeData);
      } catch (err) {
        console.error('Cars Error:', err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  /* ================= FILTER ================= */

  const filteredCars = (cars || []).filter((car) => {
    const make = car.make?.toLowerCase() || '';
    const model = car.model?.toLowerCase() || '';

    const matchesSearch =
      make.includes(search.toLowerCase()) ||
      model.includes(search.toLowerCase());

    const matchesType =
      filter === 'All' || car.type === filter;

    return matchesSearch && matchesType;
  });

  const categories = ['All', 'Luxury', 'SUV', 'Sport', 'Coupe'];

  /* ================= UI ================= */

  return (
    <div className={styles.page}>
      <div className="scanline" />

      <div className={styles.container}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>

          {/* SEARCH */}
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

          {/* FILTER */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Category_Node</h4>

            <div className={styles.categoryGrid}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`${styles.categoryButton} ${
                    filter === cat ? styles.categoryButtonActive : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* CONTENT */}
        <main className={styles.content}>

          <header className={styles.header}>
            <div>
              <p className="mono-text text-accent mb-2">[ DATA_STREAM ]</p>
              <h1 className={styles.title}>Asset_Inventory</h1>
            </div>

            <div className={styles.resultsCount}>
              COUNT :: {filteredCars.length}
            </div>
          </header>

          {/* GRID */}
          <div className={styles.grid}>

            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 ledger-card animate-pulse border border-border" />
              ))
            ) : (
              <AnimatePresence>
                {filteredCars.map((car, i) => (
                  <motion.div
                    key={String(car.id)}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/cars/${car.id}`}>

                      <div className="ledger-card h-full flex flex-col group">

                        {/* IMAGE */}
                        <div className="relative h-56 overflow-hidden border-b border-border">
                          <Image
                            src={
                              car.image
                                ? car.image.startsWith('http')
                                  ? car.image
                                  : `/${car.image}`
                                : '/placeholder.jpg'
                            }
                            alt={car.model || 'Car'}
                            fill
                            className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                          />

                          <div className="absolute bottom-0 left-0 bg-accent text-background px-4 py-1 mono-text text-[10px] font-black z-10">
                            {(car.type || 'UNKNOWN').toUpperCase()}
                          </div>
                        </div>

                        {/* DETAILS */}
                        <div className="p-8 flex flex-col flex-grow">

                          <div className="flex justify-between items-start mb-6">

                            <div>
                              <h3 className="text-2xl font-black text-primary uppercase">
                                {car.make || 'Unknown'}{' '}
                                <span className="text-accent">
                                  {car.model || ''}
                                </span>
                              </h3>

                              <p className="mono-text text-[10px] text-muted">
                                {car.year || '----'} {"//"} {" "}{car.transmission || 'N/A'}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-black text-primary">
                                ₹{(car.pricePerDay || 0).toLocaleString('en-IN')}
                              </p>
                              <p className="mono-text text-[9px] text-muted">
                                Per_Cycle
                              </p>
                            </div>

                          </div>

                          {/* FOOTER */}
                          <div className="mt-auto pt-6 border-t border-border flex justify-between">

                            <div className="flex gap-6">
                              <div className="mono-text text-[10px] flex items-center gap-2">
                                <Star className="w-3 h-3 text-accent" /> 4.9
                              </div>
                              <div className="mono-text text-[10px] flex items-center gap-2">
                                <Shield className="w-3 h-3 text-accent" /> OK
                              </div>
                            </div>

                            <ChevronRight />

                          </div>

                        </div>
                      </div>

                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {!loading && filteredCars.length === 0 && (
              <div className="col-span-full text-center py-20">
                No Cars Found
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}