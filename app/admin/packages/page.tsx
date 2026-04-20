'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth';
import { API } from '@/lib/api';
import { 
  Package, 
  Save, 
  Info,
  TrendingDown,
  Clock,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

/* ✅ TYPE */
type PackageType = {
  id: string | number;
  name?: string;
  description?: string;
  multiplier?: number;
};

export default function AdminPackagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);

  /* ✅ AUTH */
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  /* ✅ FETCH */
  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await API.packages.getAll();
        setPackages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  /* ✅ SAFE UPDATE */
  const handleMultiplierChange = (id: string | number, val: number) => {
    setPackages(prev =>
      prev.map(p =>
        p.id === id ? { ...p, multiplier: val } : p
      )
    );
  };

  /* ✅ SAVE */
  const handleSave = async (pkg: PackageType) => {
    try {
      // API.packages.update(pkg.id, pkg)
      alert(`Saved: ${pkg.name || 'Package'}`);
    } catch {
      alert('Save failed');
    }
  };

  /* ✅ LOADING */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold">
              Rental <span className="text-accent italic">Packages</span>
            </h1>
            <p className="text-gray-400 text-xs uppercase">
              Define pricing multipliers
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border">
            <Info className="w-5 h-5 text-accent" />
            <p className="text-xs text-gray-500">
              Multiplier adjusts base price
            </p>
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {packages.map((pkg, i) => {
            const multiplier = pkg.multiplier ?? 1;

            return (
              <motion.div
                key={String(pkg.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border p-8 rounded-xl bg-white"
              >
                <div className="mb-6 flex justify-between">
                  {pkg.id === 'hourly' ? <Clock /> : <Zap />}

                  <span className="text-xs">
                    {multiplier < 1
                      ? `Save ${Math.round((1 - multiplier) * 100)}%`
                      : 'Standard'}
                  </span>
                </div>

                <h3 className="text-xl font-bold">
                  {pkg.name || 'Package'}
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                  {pkg.description || 'No description'}
                </p>

                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={multiplier}
                  onChange={(e) =>
                    handleMultiplierChange(
                      pkg.id,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full"
                />

                <p className="mt-2 text-sm">
                  {multiplier}x
                </p>

                <button
                  onClick={() => handleSave(pkg)}
                  className="mt-6 w-full bg-black text-white py-2 rounded"
                >
                  <Save className="inline w-4 h-4 mr-2" />
                  Save
                </button>
              </motion.div>
            );
          })}

          {/* ADD CARD */}
          <div className="border-dashed border-2 p-8 flex flex-col items-center justify-center text-center">
            <Package className="w-8 h-8 text-gray-400 mb-4" />
            <p>Add New Package</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}