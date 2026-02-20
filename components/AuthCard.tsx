"use client";

import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import GoogleAuthButton from './AuthButton';

export const AuthCard = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative max-w-md w-full"
            >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/50 to-purple-500/50 rounded-2xl blur opacity-20" />

                {/* Card */}
                <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Icon */}
                    {/* <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div> */}

                    {/* Heading */}
                    <h2 className="text-2xl font-display font-bold text-center mb-2">
                        Welcome to TestimonialHub
                    </h2>

                    <p className="text-zinc-400 text-center mb-8">
                        Sign in to start collecting testimonials and building your reputation.
                    </p>

                    {/* Google Sign In Button */}
                    <div className='flex w-full justify-center'>
                        <GoogleAuthButton />
                    </div>

                    {/* Features list */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-xs text-zinc-500 text-center mb-4 uppercase tracking-wider">
                            What you get
                        </p>
                        <div className="space-y-3">
                            {[
                                'Unlimited testimonial collection',
                                'Beautiful public profile page',
                                'Audio testimonials support',
                                'Developer API access',
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer note */}
                    <p className="text-xs text-zinc-500 text-center mt-6">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </motion.div>
        </div>
    );
};