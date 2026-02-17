import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass-panel rounded-xl p-6 relative overflow-hidden group",
        className
      )}
    >
      {/* Increased hover opacity from 5% to 15% (approx 10% increase) */}
      <div className="absolute inset-0 bg-linear-to-br from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {children}
    </motion.div>
  );
};