'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { Search, MapPin, Calendar, Car, ChevronRight, Star, Shield, Clock, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Home.module.css';

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [carsData, locationsData] = await Promise.all([
          API.cars.getAll(),
          API.locations.getAll()
        ]);
        setFeaturedCars(carsData.slice(0, 3));
        setLocations(locationsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="bg-background">
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="scanline" />
          <div className={styles.heroBg}>
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
              alt="Cyber Car"
              className={styles.heroImg}
            />
            <div className={styles.heroOverlay} />
          </div>

          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className={styles.badge}>
                Terminal_Session_01 // Fleet_Access
              </span>
              <h1 className={styles.title}>
                Frank<br />
                <span className={styles.titleAccent}>Mobility</span>
              </h1>
              <p className={styles.description}>
                High-performance vehicle acquisition protocol. Specialized for elite operators and technical consultants.
              </p>
            </motion.div>

            {/* Filter Ledger */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={styles.filterCard}
            >
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Location_ID</label>
                <select className={styles.filterInput}>
                  <option>Select_Node</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Temporal_Start</label>
                <input type="date" className={styles.filterInput} />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Class_Spec</label>
                <select className={styles.filterInput}>
                  <option>All_Variants</option>
                  <option>Hackback</option>
                  <option>SUV_Utility</option>
                  <option>sedon</option>
                </select>
              </div>

              <div className="flex items-end">
                <Link
                  href="/cars"
                  className="btn-cyber btn-cyber-active w-full"
                >
                  Execute_Search
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Fleet Ledger */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="mono-text text-accent mb-4">[ DATABASE_SCAN ]</p>
              <h2 className={styles.sectionTitle}>Featured_Assets</h2>
            </div>
            <Link href="/cars" className="mono-text text-xs text-muted hover:text-accent transition-colors flex items-center gap-2">
              Access_Full_Directory <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className={styles.grid}>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-80 ledger-card animate-pulse" />)
            ) : (
              featuredCars.map((car) => (
                <Link key={car.id} href={`/cars/${car.id}`} style={{ textDecoration: 'none' }}>
                  <div className="ledger-card h-full flex flex-col">
                    <div className="relative h-60 overflow-hidden border-b border-border">
                      <img
                        src={car.image.startsWith('http') ? car.image : `/${car.image}`}
                        alt={car.model}
                        className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute top-0 right-0 bg-accent text-background px-3 py-1 mono-text text-[9px] font-black">
                        {car.type}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-black text-primary mb-1 uppercase tracking-tighter">{car.make} <span className="text-accent">{car.model}</span></h3>
                          <p className="mono-text text-[10px] text-muted">{car.year} // {car.transmission}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-primary">₹{car.pricePerDay}</p>
                          <p className="mono-text text-[9px] text-muted">Per_Cycle</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="mono-text text-[9px] text-muted flex items-center gap-1.5">
                            <Star className="w-3 h-3 text-accent" /> 4.9
                          </div>
                          <div className="mono-text text-[9px] text-muted flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-accent" /> Secured
                          </div>
                        </div>
                        <div className="p-2 border border-border group-hover:border-accent transition-colors">
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* System Benefits */}
        <section className={styles.benefitsSection}>
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-20">
              <p className="mono-text text-accent mb-4">[ PROTOCOL_ADVANTAGES ]</p>
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-6">Why_Luxe_Drive?</h2>
              <p className="text-muted max-w-xl mx-auto font-medium">[ Error-free vehicle deployment and cryptographic transaction security ]</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                { icon: Shield, title: "INTEGRITY_CHECK", desc: "Every asset undergoes real-time diagnostic synchronization before deployment." },
                { icon: Clock, title: "NULL_LATENCY", desc: "Near-instantaneous requisition and deployment across all metropolitan nodes." },
                { icon: Car, title: "DIRECT_UPLINK", desc: "Automated vehicle redirection to your current geolocation coordinates." }
              ].map((benefit, i) => (
                <div key={i} className="ledger-card p-10 group">
                  <div className="w-12 h-12 border border-border flex items-center justify-center mb-8 border-accent group-hover:bg-accent group-hover:text-background transition-all">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <h3 className="mono-text text-sm font-black mb-4">{benefit.title}</h3>
                  <p className="text-muted text-xs leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
