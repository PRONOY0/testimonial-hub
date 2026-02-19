"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import GoogleAuthButton from '../AuthButton';
import { SettingsDialog } from '@/components/SettingsDialog';
import { FiCode } from "react-icons/fi";


export const Navbar: React.FC = () => {
  const { user, dbUser, loading } = useUser();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group" data-hover="true">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight group-hover:text-white transition-colors text-zinc-300">
                TestimonialHub
              </span>
            </Link>

            <div className="flex items-center gap-6">
              {loading ? null : user ? (
                // ✅ Logged In
                <div className="flex items-center gap-4">
                  {/* Settings Button */}
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  <Link href="/api-docs" className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors" title="API Docs">
                    <FiCode className="w-5 h-5" />
                  </Link>

                  {/* Profile Avatar */}
                  <Link href="/dashboard" className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-white/20 transition-colors">
                    <img
                      src={dbUser?.avatarUrl || user.photoURL || `https://api.dicebear.com/9.x/lorelei/svg?seed=${user.uid}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
              ) : (
                <>
                  <GoogleAuthButton />
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Settings Dialog */}
      <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};