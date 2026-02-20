"use client";
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-32 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-12">

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 group opacity-60 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg">TestimonialHub</span>
                    </Link>

                    <div className="text-sm text-zinc-600">
                        © {currentYear} TestimonialHub. All rights reserved.
                    </div>

                    <motion.a
                        href="https://devpronoy.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group"
                    >
                        <span>Built by</span>
                        <span className="font-semibold text-white">Pronoy Roy</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>

                </div>

            </div>
        </footer>
    );
};