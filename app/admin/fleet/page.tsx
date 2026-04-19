'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Car, 
  Save, 
  X,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './AdminFleet.module.css';

export default function AdminFleetPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2024,
    type: 'Luxury',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    seats: 5,
    pricePerDay: 0,
    pricePerHour: 0,
    pricePerWeekly: 0,
    pricePerMonthly: 0,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200',
    location: 'Airport',
    available: true,
    features: [],
    specifications: { engine: '', power: '' }
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await API.cars.getAll();
      setCars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (car = null) => {
    if (car) {
      setEditingCar(car);
      setFormData({ ...car });
    } else {
      setEditingCar(null);
      setFormData({
        make: '',
        model: '',
        year: 2024,
        type: 'Luxury',
        transmission: 'Automatic',
        fuel: 'Gasoline',
        seats: 5,
        pricePerDay: 0,
        pricePerHour: 0,
        pricePerWeekly: 0,
        pricePerMonthly: 0,
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200',
        location: 'Airport',
        available: true,
        features: [],
        specifications: { engine: '', power: '' }
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await API.cars.update(editingCar.id, formData);
      } else {
        await API.cars.create(formData);
      }
      setModalOpen(false);
      fetchCars();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this vehicle from fleet?')) return;
    try {
      await API.cars.delete(id);
      fetchCars();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredCars = cars.filter(c => 
    c.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className="scanline" />
      <main className={styles.container}>
        <header className={styles.header}>
            <div>
              <p className={styles.subtitle}>[ LOGISTICS_MGMT_v1.2 ]</p>
              <h1 className={styles.title}>Fleet_Inventory</h1>
            </div>
            
            <div className={styles.controls}>
              <div className={styles.searchWrapper}>
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                 <input 
                    type="text" 
                    placeholder="SCAN_FLEET..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <button 
                 onClick={() => handleOpenModal()}
                 className="btn-cyber btn-cyber-active"
                 style={{ padding: '0 2rem' }}
              >
                 + Initialize_New_Asset
              </button>
            </div>
        </header>

        <div className={styles.fleetList}>
           {loading ? (
             [1, 2, 3].map(i => <div key={i} className="h-24 bg-surface border border-border animate-pulse" />)
           ) : filteredCars.length === 0 ? (
             <div className="p-20 text-center border border-dashed border-border">
                <Car className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="mono-text text-xs text-muted">[ NO_MATCHING_ASSETS_FOUND ]</p>
             </div>
           ) : (
             filteredCars.map((car) => (
                <div key={car.id} className={styles.carRow}>
                   <img src={car.image.startsWith('http') ? car.image : `/${car.image}`} className={styles.carImage} />
                   
                   <div className={styles.carInfo}>
                      <h3>{car.make} {car.model}</h3>
                      <div className={styles.carMeta}>
                         <span>TYPE::{car.type.toUpperCase()}</span>
                         <span>•</span>
                         <span>Y::{car.year}</span>
                         <span>•</span>
                         <span style={{ color: car.available ? '#00ff00' : '#ff4444' }}>
                           {car.available ? 'AVAILABLE' : 'RESERVED'}
                         </span>
                      </div>
                   </div>

                   <div className={styles.pricing}>
                      <p className={styles.priceValue}>₹{car.pricePerDay.toLocaleString('en-IN')}</p>
                      <p className={styles.priceLabel}>BASE_DEBIT_DAY</p>
                   </div>

                   <div className={styles.actions}>
                      <button 
                        onClick={() => handleOpenModal(car)}
                        className={styles.actionBtn}
                      >
                         <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleDelete(car.id)}
                         className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             ))
           )}
        </div>

        {/* Action Modal */}
        <AnimatePresence>
           {modalOpen && (
             <div className={styles.modalOverlay}>
                <motion.div 
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   className={styles.modalContent}
                >
                   <form onSubmit={handleSubmit}>
                      <div className={styles.modalHeader}>
                         <div>
                            <p className={styles.subtitle}>[ ASSET_DEFINITION_PROTOCOL ]</p>
                            <h2 className="text-2xl font-black uppercase">{editingCar ? 'Update_Asset' : 'New_Asset_Entry'}</h2>
                         </div>
                         <button type="button" onClick={() => setModalOpen(false)} className="mono-text text-muted hover:text-white uppercase">[ CLOSE ]</button>
                      </div>

                      <div className={styles.modalBody}>
                         <div className={styles.formGrid}>
                            <div>
                               <div className={styles.inputGroup}>
                                  <label className={styles.label}>Visual_Uplink_URL</label>
                                  <input 
                                     type="text" 
                                     className={styles.input}
                                     value={formData.image}
                                     onChange={(e) => setFormData({...formData, image: e.target.value})}
                                  />
                               </div>
                               <div className="aspect-video bg-surface-accent border border-border overflow-hidden">
                                  <img src={formData.image && (formData.image.startsWith('http') ? formData.image : `/${formData.image}`)} className="w-full h-full object-cover grayscale" alt="Preview" style={{ objectFit: 'cover' }} />
                               </div>
                            </div>

                            <div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className={styles.inputGroup}>
                                     <label className={styles.label}>Manufacturer</label>
                                     <input 
                                        type="text" 
                                        className={styles.input}
                                        value={formData.make}
                                        onChange={(e) => setFormData({...formData, make: e.target.value})}
                                        required
                                     />
                                  </div>
                                  <div className={styles.inputGroup}>
                                     <label className={styles.label}>Model_ID</label>
                                     <input 
                                        type="text" 
                                        className={styles.input}
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                        required
                                     />
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                  <div className={styles.inputGroup}>
                                     <label className={styles.label}>Classification</label>
                                     <select 
                                        className={styles.input}
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                     >
                                        <option>Luxury</option>
                                        <option>SUV</option>
                                        <option>Sport</option>
                                        <option>Coupe</option>
                                     </select>
                                  </div>
                                  <div className={styles.inputGroup}>
                                     <label className={styles.label}>Cycle_Year</label>
                                     <input 
                                        type="number" 
                                        className={styles.input}
                                        value={formData.year}
                                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                                     />
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                  <div className={styles.inputGroup}>
                                     <label className={styles.label}>Daily_Price_Array</label>
                                     <input 
                                        type="number" 
                                        className={styles.input}
                                        value={formData.pricePerDay}
                                        onChange={(e) => setFormData({...formData, pricePerDay: parseInt(e.target.value)})}
                                     />
                                  </div>
                                  <div className={styles.inputGroup}>
                                     <label className={styles.label}>Hourly_Price_Array</label>
                                     <input 
                                        type="number" 
                                        className={styles.input}
                                        value={formData.pricePerHour}
                                        onChange={(e) => setFormData({...formData, pricePerHour: parseInt(e.target.value)})}
                                     />
                                  </div>
                               </div>

                               <div className="mt-8 p-6 bg-surface-accent border border-border">
                                  <label className="flex items-center gap-4 cursor-pointer">
                                     <input 
                                        type="checkbox" 
                                        className="w-4 h-4 accent-accent" 
                                        checked={formData.available}
                                        onChange={(e) => setFormData({...formData, available: e.target.checked})}
                                     />
                                     <span className="mono-text text-[10px] text-muted uppercase">Broadcast_Availability_to_Mesh</span>
                                  </label>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className={styles.modalFooter}>
                         <button type="submit" className="btn-cyber btn-cyber-active flex-grow py-5 uppercase font-black">
                            {editingCar ? 'Overwrite_Existing_Record' : 'Commit_New_Data'}
                         </button>
                      </div>
                   </form>
                </motion.div>
             </div>
           )}
        </AnimatePresence>
      </main>
    </div>
  );
}
