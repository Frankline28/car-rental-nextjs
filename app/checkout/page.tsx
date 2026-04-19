'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Car as CarIcon, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Checkout.module.css';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const carId = searchParams.get('carId');
  const pkgId = searchParams.get('package');

  const [car, setCar] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingDate, setBookingDate] = useState('');
  
  // Payment States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.href));
      return;
    }

    async function fetchData() {
      if (!carId || !pkgId) return;
      try {
        const [carData, packagesData] = await Promise.all([
          API.cars.getOne(carId),
          API.packages.getAll()
        ]);
        setCar(carData);
        setPkg(packagesData.find(p => p.id === pkgId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [carId, pkgId, user, authLoading, router]);

  const calculateTotal = () => {
    if (!car || !pkg) return 0;
    let base = 0;
    if (pkg.id === 'hourly') base = car.pricePerHour;
    else if (pkg.id === 'weekly') base = car.pricePerWeekly;
    else if (pkg.id === 'monthly') base = car.pricePerMonthly;
    else base = car.pricePerDay;
    return base + 2000; // Base + Fees in INR
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      await API.bookings.create({
        userId: user.id,
        carId: car.id,
        carName: `${car.make} ${car.model}`,
        carImage: car.image,
        packageId: pkg.id,
        packageName: pkg.name,
        date: bookingDate || new Date().toISOString(),
        totalAmount: calculateTotal(),
        status: 'confirmed',
        paymentMethod,
        timestamp: new Date().toISOString()
      });
      setStep(3);
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="mt-6 mono-text text-[10px] text-muted animate-pulse">[ INITIALIZING_SECURE_CHECKOUT ]</p>
     </div>
  );

  return (
    <div className={styles.page}>
      <div className="scanline" />
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <p className="mono-text text-accent mb-6">
              [ TRANSACTION_GATEWAY_v4.2 ]
            </p>
            <h1 className={styles.title}>Confirm_Reservation</h1>
          </header>

          <div className={styles.stepContainer}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={styles.step}
                >
                  <div className={styles.stepHeader}>
                    <div className={styles.stepNumber}>01</div>
                    <h2 className={styles.stepTitle}>OPERATIONAL_DETAILS</h2>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Deployment_Timestamp</label>
                      <input 
                        type="datetime-local" 
                        className={styles.input}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Assigned_Hub</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={car.location + " CORE"}
                        className={styles.input}
                        style={{ opacity: 0.6 }}
                      />
                    </div>
                  </div>

                  <div className="mt-12 p-8 border border-accent/20 bg-surface-accent">
                    <p className="mono-text text-[10px] text-accent mb-4 flex items-center gap-2">
                       <Shield className="w-4 h-4" /> IDENTITY_VERIFICATION::REQUIRED
                    </p>
                    <p className="mono-text text-[9px] text-muted leading-relaxed">
                      BOOKING AS IDENTITY::[ {user.name.toUpperCase()} ]. OPERATOR MUST PRESENT VALID BIOMETRIC ID AND CREDIT INSTRUMENTS AT DEPLOYMENT NODE.
                    </p>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!bookingDate}
                    className="btn-cyber btn-cyber-active w-full py-5 mt-12 disabled:opacity-30"
                  >
                    Next_Step // Transfer_Process {">"}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={styles.step}
                >
                  <div className={styles.stepHeader}>
                    <div className={styles.stepNumber}>02</div>
                    <h2 className={styles.stepTitle}>TRANSACTION_METHOD</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-12">
                    {[
                      { id: 'card', name: 'CREDIT', icon: CreditCard },
                      { id: 'wallet', name: 'DIGITAL', icon: Wallet },
                      { id: 'cash', name: 'OFFLINE', icon: Banknote }
                    ].map(method => (
                      <button 
                         key={method.id}
                         onClick={() => setPaymentMethod(method.id)}
                         className={`btn-cyber ${paymentMethod === method.id ? 'btn-cyber-active' : ''} flex flex-col items-center gap-3 py-6`}
                      >
                         <method.icon className="w-5 h-5" />
                         <span className="mono-text text-[8px]">{method.name}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                       <div className={styles.formGroup}>
                          <label className={styles.label}>Instrument_Holder</label>
                          <input 
                             type="text" 
                             className={styles.input}
                             value={cardName}
                             onChange={(e) => setCardName(e.target.value)}
                          />
                       </div>
                       <div className={styles.formGroup}>
                          <label className={styles.label}>Instrument_Number</label>
                          <input 
                             type="text" 
                             className={styles.input}
                             value={cardNumber}
                             onChange={(e) => setCardNumber(e.target.value)}
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className={styles.formGroup}>
                             <label className={styles.label}>Temporal_End</label>
                             <input 
                                type="text" 
                                className={styles.input}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                             />
                          </div>
                          <div className={styles.formGroup}>
                             <label className={styles.label}>Security_Net</label>
                             <input 
                                type="password" 
                                className={styles.input}
                                value={cardCVC}
                                onChange={(e) => setCardCVC(e.target.value)}
                             />
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-12">
                    <button onClick={() => setStep(1)} className="btn-cyber flex-1">Back_Protocol</button>
                    <button 
                       onClick={handleConfirm}
                       disabled={submitting || (paymentMethod === 'card' && (!cardName || !cardNumber || !cardExpiry || !cardCVC))}
                       className="btn-cyber btn-cyber-active flex-[2] py-5"
                    >
                       {submitting ? "[ SYNCING... ]" : "Authorize_Transaction"}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.step}
                  style={{ textAlign: 'center', padding: '5rem' }}
                >
                  <div className="w-20 h-20 border border-accent flex items-center justify-center mx-auto mb-10">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-4xl font-black text-primary mb-6 uppercase tracking-tighter">Asset_Secured</h2>
                  <p className="mono-text text-xs text-muted leading-relaxed mb-12 max-w-sm mx-auto">
                    DEPLOYMENT SCHEDULED FOR {car.make.toUpperCase()} {car.model.toUpperCase()}. DIGITAL DOSSIER SENT TO {user.email.toUpperCase()}.
                  </p>
                  
                  <div className="flex flex-col gap-4 max-w-xs mx-auto">
                    <Link href="/dashboard/my-bookings" className="btn-cyber btn-cyber-active">Access_Itinerary</Link>
                    <Link href="/" className="btn-cyber">End_Session</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.summarySidebar}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>RESERVATION_MODESTO</h3>
            
            <div className="mb-10 text-center">
              <img src={car.image.startsWith('http') ? car.image : `/${car.image}`} className="w-full grayscale border border-border mb-6" />
              <h4 className="text-xl font-black text-primary uppercase tracking-tighter">{car.make} {car.model}</h4>
              <p className="mono-text text-[9px] text-muted mt-2">{car.year} // {pkg.name.toUpperCase()}_CLASS</p>
            </div>

            <div className="space-y-4 mb-10">
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Base_Payload</span>
                <span className={styles.summaryValue}>₹{(calculateTotal() - 2000).toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Security_Array</span>
                <span className={styles.summaryValue}>₹1,250.00</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Network_Latency_Fee</span>
                <span className={styles.summaryValue}>₹750.00</span>
              </div>
            </div>

            <div className={styles.totalRow}>
               <span className={styles.totalLabel}>TOTAL_DEBIT</span>
               <span className={styles.totalValue}>₹{calculateTotal().toLocaleString('en-IN')}</span>
            </div>
            
            <div className="mt-10 p-4 border border-border bg-surface-accent flex gap-4 items-center">
               <ShieldCheck className="w-5 h-5 text-accent" />
               <p className="mono-text text-[8px] text-muted uppercase">Encrypted_Uplink::Active</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
       <CheckoutContent />
    </Suspense>
  );
}
