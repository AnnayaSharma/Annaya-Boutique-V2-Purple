'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-lavender-bg">
      <div className="max-w-md w-full flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-royal-purple/10"
        >
          <CheckCircle2 size={48} className="text-royal-purple" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-serif font-bold mb-4 text-deep-purple">
          Thank You!
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-muted-text mb-2 text-lg">
          We've received your details we will get back to you soon!
        </motion.p>



        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="text-xs text-muted-text mb-12">
          Your items will be dispatched to you soon!
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-col w-full gap-4">
          <Link href="/shop"
            className="bg-royal-purple text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-royal-purple/20 hover:opacity-90 transition-opacity">
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
