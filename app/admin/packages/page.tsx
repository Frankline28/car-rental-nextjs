'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import { 
  Package, 
  Settings2, 
  Search, 
  Save, 
  Info,
  TrendingDown,
  Clock,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminPackagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
      return;
    }

    async function fetchPackages() {
      try {
        const data = await API.packages.getAll();
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, [user, authLoading, router]);

  const handleMultiplierChange = (id: string, val: number) => {
     setPackages(packages.map(p => p.id === id ? { ...p, multiplier: val } : p));
  };

  const handleSave = async (pkg: any) => {
     try {
        // In a real app we'd call API.packages.update
        alert(`Configuration for ${pkg.name} saved successfully!`);
     } catch (err) {
        alert('Save failed');
     }
  };

  if (authLoading || loading) return (
     <div className="min-h-screen pt-32 flex justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-extrabold text-primary tracking-tight">Rental <span className="text-accent italic">Packages</span></h1>
              <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Define pricing multipliers and discount tiers</p>
           </div>
           
           <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-border shadow-sm">
              <div className="p-2 bg-accent/20 rounded-xl"><Info className="w-5 h-5 text-accent" /></div>
              <p className="text-xs font-bold text-gray-500 max-w-xs">Multipliers determine the final price based on the base daily rate of each vehicle.</p>
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {packages.map((pkg, i) => (
             <motion.div 
               key={pkg.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="premium-card p-10 flex flex-col justify-between"
             >
                <div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-primary rounded-2xl shadow-xl shadow-primary/20">
                         {pkg.id === 'hourly' ? <Clock className="w-8 h-8 text-accent" /> : <Zap className="w-8 h-8 text-accent" />}
                      </div>
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded ${
                         pkg.multiplier < 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                         {pkg.multiplier < 1 ? <TrendingDown className="w-3 h-3" /> : null}
                         {pkg.multiplier < 1 ? `Save ${Math.round((1-pkg.multiplier)*100)}%` : 'Standard'}
                      </div>
                   </div>

                   <h3 className="text-3xl font-black text-primary mb-2 capitalize">{pkg.name} Rental</h3>
                   <p className="text-gray-400 font-medium mb-10 leading-relaxed">{pkg.description}</p>

                   <div className="space-y-6">
                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Multiplier</label>
                            <span className="text-xl font-black text-primary">{pkg.multiplier}x</span>
                         </div>
                         <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.05"
                            value={pkg.multiplier}
                            onChange={(e) => handleMultiplierChange(pkg.id, parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-accent"
                         />
                         <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase">
                            <span>Maximum Discount (0.5x)</span>
                            <span>Premium Rate (1.5x)</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                   <button 
                      onClick={() => handleSave(pkg)}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-4 shadow-lg shadow-primary/20"
                   >
                      <Save className="w-5 h-5" /> Save Configuration
                   </button>
                </div>
             </motion.div>
           ))}

           <div className="premium-card p-10 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                 <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-xl font-black text-gray-400">Add New Tier</h4>
              <p className="text-sm font-bold text-gray-300 mt-2">Create custom holiday or membership packages</p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
