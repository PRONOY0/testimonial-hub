/* eslint-disable react-hooks/purity */
"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Home, Terminal, Activity } from 'lucide-react';

export default function NotFound () {

    return (
        <div className="min-h-screen text-white overflow-hidden relative font-sans selection:bg-white selection:text-black">
            {/* //* Grid Background with Spotlight Reveal */}
            {/* <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                    maskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
                }}
            /> */}
            {/* //* Above code is grid generation bg */}

            <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-24">

                {/* Left Side: Massive 404 */}
                <div className="flex-1 w-full lg:w-auto flex flex-col items-start justify-center">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <h1 className="text-[12rem] sm:text-[18rem] lg:text-[24rem] leading-[0.8] font-bold tracking-tighter text-white mix-blend-difference select-none">
                            404
                        </h1>
                        <div className="absolute -bottom-4 left-2 flex items-center gap-3 text-zinc-500 font-mono text-sm uppercase tracking-widest">
                            <Activity className="w-4 h-4 animate-pulse text-red-500" />
                            <span>Signal Lost</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Editorial/Technical Details */}
                <div className="flex-1 w-full max-w-xl flex flex-col gap-8 lg:border-l lg:border-zinc-800 lg:pl-12 py-12">

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                            <Terminal size={12} />
                            <span>ERR_PAGE_NOT_FOUND</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                            We can&apos;t find that page.
                        </h2>

                        <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                            The requested URL was not found on this server. That’s all we know. It might be a typo, a broken link, or a page that has been moved to a new dimension.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Link
                            href="/"
                            className="group h-12 px-8 bg-white text-black rounded-none hover:rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                        >
                            <Home size={18} />
                            <span>Return Home</span>
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="group h-12 px-8 bg-transparent border border-zinc-700 text-white rounded-none hover:rounded-lg hover:border-white transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Go Back</span>
                        </button>
                    </motion.div>

                    {/* Technical Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="pt-12 mt-auto border-t border-zinc-900"
                    >
                        <div className="grid grid-cols-2 gap-4 font-mono text-xs text-zinc-600 uppercase tracking-wider">
                            <div>
                                <span className="block text-zinc-800 mb-1">Status</span>
                                <span className="text-red-500">404 Not Found</span>
                            </div>
                            <div>
                                <span className="block text-zinc-800 mb-1">Ref</span>
                                <span>{Math.random().toString(36).substring(7).toUpperCase()}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
