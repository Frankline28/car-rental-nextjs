'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  Shield, 
  Clock, 
  Car, 
  MapPin, 
  Star, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Users, 
  Fuel, 
  Gauge, 
  ArrowLeft,
  Calendar,
  ShieldCheck,
  MousePointer2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CarDetails.module.css';

export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('daily');

  useEffect(() => {
    async function fetchData() {
      try {
        const [carData, packagesData] = await Promise.all([
          API.cars.getOne(id as string),
          API.packages.getAll()
        ]);
        setCar(carData);
        setPackages(packagesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="mt-6 mono-text text-[10px] text-muted animate-pulse">[ RETRIEVING_ASSET_DOSSIER ]</p>
    </div>
  );

  if (!car) return (
    <div className={styles.page}>
       <div className="max-w-7xl mx-auto px-4 text-center py-40">
          <Car className="w-16 h-16 text-muted mx-auto mb-6" />
          <h2 className="text-2xl font-black text-primary mb-4 uppercase">[ ERROR: ASSET_NOT_LOCATED ]</h2>
          <Link href="/cars" className="btn-cyber">Back_to_Fleet</Link>
       </div>
    </div>
  );

  const currentPrice = () => {
    switch(selectedPackage) {
      case 'hourly': return car.pricePerHour;
      case 'weekly': return car.pricePerWeekly;
      case 'monthly': return car.pricePerMonthly;
      default: return car.pricePerDay;
    }
  };

  const handleBooking = () => {
    router.push(`/checkout?carId=${car.id}&package=${selectedPackage}`);
  };

  return (
    <div className={styles.page}>
      <div className="scanline" />
      <main className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Link href="/cars" className="mono-text text-[10px] text-accent mb-6 flex items-center gap-2 hover:gap-4 transition-all">
              <ArrowLeft className="w-3 h-3" /> RETURN_TO_DIRECTORY
            </Link>
            <div className="flex justify-between items-end gap-10">
              <div>
                <p className="mono-text text-[10px] text-muted mb-2">IDENTIFIER // {car.id.toString().padStart(6, '0')}</p>
                <h1 className={styles.title}>{car.make} <span className={styles.titleAccent}>{car.model}</span></h1>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-primary tracking-tighter">₹{currentPrice()}</p>
                <p className="mono-text text-[10px] text-muted">Starting_Rate</p>
              </div>
            </div>
          </header>

          <section className={styles.gallery}>
            <div className={styles.mainImageContainer}>
              <img src={car.image.startsWith('http') ? car.image : `/${car.image}`} alt={car.model} className={styles.mainImage} />
              <div className="absolute top-0 right-0 bg-accent text-background px-6 py-2 mono-text text-sm font-black">
                {car.type}_SPEC
              </div>
            </div>

            <div className={styles.techSpecGrid}>
               {[
                 { icon: Users, label: "Payload", value: `${car.seats} Units` },
                 { icon: Fuel, label: "Propulsion", value: car.fuel },
                 { icon: Gauge, label: "Terminal_V", value: "250 KM/H" },
                 { icon: Car, label: "Interface", value: car.transmission },
                 { icon: ShieldCheck, label: "Integrity", value: "Verified" },
                 { icon: Zap, label: "Class", value: car.type }
               ].map((item, i) => (
                 <div key={i} className={styles.techSpec}>
                    <p className={styles.techSpecLabel}><item.icon className="w-3 h-3 inline mb-1 mr-2" /> {item.label}</p>
                    <p className={styles.techSpecValue}>{item.value}</p>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-12">
            <div>
              <p className="mono-text text-accent mb-6">[ ASSET_ANALYSIS ]</p>
              <p className={styles.description}>Meticulously engineered for high-stake operations. This {car.year} {car.make} {car.model} deployment unit features advanced navigational arrays and integrated safety protocols. Optimized for both urban transit and extraction scenarios.</p>
            </div>

            <div className={styles.featureGrid}>
              {car.features.map(feature => (
                <div key={feature} className={styles.featureItem}>
                   <div className="w-1.5 h-1.5 bg-accent" />
                   <span className={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Requisition Panel */}
        <aside className={styles.bookingSidebar}>
          <div className={styles.bookingCard}>
            <p className="mono-text text-accent mb-8">[ REQUISITION_PANEL ]</p>
            
            <div className="space-y-8 mb-10">
              <div>
                <label className="mono-text text-[9px] text-muted block mb-4">Select_Package</label>
                <div className="grid grid-cols-1 gap-2">
                  {packages.map(pkg => (
                    <button 
                       key={pkg.id}
                       onClick={() => setSelectedPackage(pkg.id)}
                       className={`btn-cyber ${selectedPackage === pkg.id ? 'btn-cyber-active' : ''} w-full`}
                    >
                       {pkg.name} // ₹{car?.[`pricePer${pkg.name}`] || car.pricePerDay}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-border bg-surface-accent">
                   <div className="text-accent"><MapPin className="w-4 h-4" /></div>
                   <div>
                      <p className="mono-text text-[8px] text-muted">Node_Geolocation</p>
                      <p className="mono-text text-[10px] text-primary">{car.location} HUB</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-border bg-surface-accent">
                   <div className={car.available ? 'text-accent' : 'text-red-500'}><Calendar className="w-4 h-4" /></div>
                   <div>
                      <p className="mono-text text-[8px] text-muted">Availability_Status</p>
                      <p className="mono-text text-[10px] text-primary">{car.available ? 'READY' : 'RESERVED'}</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border mb-10">
               <div className="flex justify-between items-center mb-4">
                  <span className="mono-text text-[10px] text-muted">Gross_Subtotal</span>
                  <span className="text-xl font-black text-primary">₹{currentPrice()}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="mono-text text-[10px] text-muted">Net_Network_Fee</span>
                  <span className="mono-text text-[10px] text-primary">₹2,000.00</span>
               </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={!car.available}
              className="btn-cyber btn-cyber-active w-full py-5 text-base disabled:opacity-20"
            >
              Transfer_Credits // Next {">"}
            </button>
          </div>

          <div className="ledger-card p-8 bg-surface-accent">
             <p className="mono-text text-accent mb-4">[ SYSTEM_NOTICE ]</p>
             <p className="text-[10px] font-bold text-muted leading-relaxed uppercase">Biometric verification and valid operator credentials required for final authorization.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
