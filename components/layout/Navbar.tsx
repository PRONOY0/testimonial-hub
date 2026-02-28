"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import GoogleAuthButton from '../AuthButton';
import { FiCode } from "react-icons/fi";

export const Navbar: React.FC = () => {
  const { user, dbUser, loading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 lg:py-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 group min-w-0 shrink-0" data-hover="true">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-neon-blue to-neon-purple flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight group-hover:text-white transition-colors text-zinc-300 truncate">
                TestimonialHub
              </span>
            </Link>

            {/* Right side - Desktop */}
            <div className="hidden md:flex items-center gap-3 lg:gap-6">
              {loading ? null : user ? (
                // ✅ Logged In - Desktop
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  {/* API Docs */}
                  <Link
                    href="/api-docs"
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors shrink-0"
                    title="API Docs"
                  >
                    <FiCode className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>

                  {/* Settings Button */}
                  <Link
                    href="/Settings"
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors shrink-0"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>

                  {/* Profile Avatar */}
                  <Link
                    href="/dashboard"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-white/20 transition-colors shrink-0"
                    title="Dashboard"
                  >
                    <img
                      src={dbUser?.avatarUrl || user.photoURL || `https://api.dicebear.com/9.x/lorelei/svg?seed=${user.uid}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
              ) : (
                <GoogleAuthButton />
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {loading ? null : user ? (
                // Mobile logged in - just avatar + menu
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <img
                      src={dbUser?.avatarUrl || user.photoURL || `https://api.dicebear.com/9.x/lorelei/svg?seed=${user.uid}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Menu"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <GoogleAuthButton />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden relative"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="glass-panel rounded-2xl mt-2 px-4 py-3 backdrop-blur-xl border border-white/10 bg-white/5">
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/api-docs"
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiCode className="w-4 h-4 shrink-0" />
                      API Docs
                    </Link>
                    <Link
                      href="/Settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/10 transition-colors text-sm text-left"
                    >
                      <Settings className="w-4 h-4 shrink-0" />
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};
