'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Testimonial, unAuthorizedError } from '@/types/types';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { getuser } from '@/lib/api';
import { Loader } from '@/components/Loader';

export default function PublicProfile() {
    const params = useParams();
    const username = typeof params?.userName === "string" ? params.userName : "Alex";

    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [name, setName] = useState(null);
    const [totalTestimonials, setTotalTestimonials] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [verifiedCount, setVerifiedCount] = useState(0);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [tagline, setTagline] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get(getuser + `${username}`);
                console.log(res.data);

                setName(res.data.user.name);
                setTotalTestimonials(res.data.totalTestimonials);
                setAvgRating(res.data.avgRating);
                setAvatarUrl(res.data.user.avatarUrl);
                setVerifiedCount(res.data.verifiedCount);
                setTagline(res.data.user.tagLine);
                setCustomUrl(res.data.user.customUrl);
                setLocation(res.data.user.location);

                setTestimonials(res.data.testimonials || []);

                setLoading(false);
            } catch (error) {
                console.log(error);
                const err = error as unAuthorizedError;
                if (err.status === 404) {
                    window.location.href = '/NotFound';
                }
            }
        }

        fetchUser();
    }, [username])

    return (
        <div className="min-h-screen text-white selection:bg-neon-blue/20">
            {
                loading ?
                    (
                        <Loader />
                    )
                    :
                    (
                        <div className="pt-32 pb-24 px-6 relative">
                            {/* Ambient Glow */}
                            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                            {/* HERO SECTION */}
                            <div className="max-w-2xl mx-auto text-center mb-24 relative z-10">

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative inline-block mb-8"
                                >
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/10 relative z-10">
                                        <img
                                            src={avatarUrl || `https://api.dicebear.com/9.x/lorelei/svg?seed=${username}`}
                                            alt={name || "user profile pic"}
                                            className="w-full h-full rounded-full object-cover grayscale-[0.2]"
                                        />
                                    </div>
                                    {/* Verified Badge on Avatar */}
                                    <div className="absolute bottom-2 right-2 bg-linear-to-br from-cyan-500 to-cyan-300 p-1.5 rounded-full border-2 border-black z-20 shadow-lg">
                                        <ShieldCheck className="w-6 h-6 text-black fill-white" strokeWidth={2} />
                                    </div>
                                    {/* Soft glow behind avatar */}
                                    <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full -z-10 transform scale-110" />
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.6 }}
                                    className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                                >
                                    {name}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-lg text-zinc-400 mb-6 max-w-lg mx-auto font-light leading-relaxed"
                                >
                                    {tagline}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="flex flex-wrap justify-center gap-4 text-sm text-zinc-500 mb-10"
                                >
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                        <MapPin className="w-3.5 h-3.5" /> {location || "Earth"}
                                    </div>

                                    {/* //! Custom Link Mostly for Portfolio Or Behance */}
                                    {
                                        customUrl && (
                                            <a href={`${customUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:text-white transition-colors">
                                                <Globe className="w-3.5 h-3.5" /> {customUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                            </a>
                                        )
                                    }
                                </motion.div>

                                {/* STATS BAR */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto"
                                >
                                    <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center backdrop-blur-sm group hover:border-white/10 transition-colors">
                                        <div className="text-2xl font-display font-bold text-white mb-1 group-hover:scale-105 transition-transform">{totalTestimonials}</div>
                                        <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider font-medium text-center">Client Stories</div>
                                    </div>

                                    <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center backdrop-blur-sm group hover:border-white/10 transition-colors relative overflow-hidden">
                                        <div className="absolute inset-0 bg-linear-to-b from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="text-2xl font-display font-bold text-white mb-1 flex items-center gap-1 group-hover:scale-105 transition-transform">
                                            {avgRating} <Star className="w-4 h-4 fill-neon-blue text-neon-blue" />
                                        </div>
                                        <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider font-medium text-center">Overall Rating</div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1 bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center backdrop-blur-sm group hover:border-white/10 transition-colors">
                                        <div className="text-2xl font-display font-bold text-white mb-1 group-hover:scale-105 transition-transform">{verifiedCount}</div>
                                        <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider font-medium text-center">Verified Experiences</div>
                                    </div>
                                </motion.div>
                            </div>

                            {
                                loading ?
                                    (<>
                                        <p>Loading...</p>
                                    </>)
                                    :
                                    (<>
                                        <div className="max-w-212.5 mx-auto">
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6, duration: 0.8 }}
                                                className="flex items-center justify-center gap-4 mb-16"
                                            >
                                                <div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent flex-1" />
                                                <h2 className="font-display text-lg tracking-widest text-zinc-500 uppercase">What Clients Say</h2>
                                                <div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent flex-1" />
                                            </motion.div>

                                            {
                                                testimonials.length > 6 ?
                                                    (
                                                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                                                            {testimonials.map((testimonial, i) => (
                                                                <motion.div
                                                                    key={testimonial.id}
                                                                    initial={{ opacity: 0, y: 40 }}
                                                                    whileInView={{ opacity: 1, y: 0 }}
                                                                    viewport={{ once: true, margin: "-50px" }}
                                                                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                                                    className="break-inside-avoid mb-6"
                                                                >
                                                                    <div className="group relative">
                                                                        {/* Quote decoration - only show on desktop */}
                                                                        <div className="absolute -left-12 -top-8 text-zinc-800 opacity-0 lg:group-hover:opacity-50 transition-opacity duration-700 pointer-events-none hidden lg:block">
                                                                            <Quote className="w-20 h-20 fill-current transform scale-x-[-1]" />
                                                                        </div>

                                                                        <TestimonialCard
                                                                            data={testimonial}
                                                                            index={i}
                                                                        />
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <div className="space-y-8 md:space-y-12">
                                                            {testimonials.map((testimonial, i) => (
                                                                <motion.div
                                                                    key={testimonial.id}
                                                                    initial={{ opacity: 0, y: 40 }}
                                                                    whileInView={{ opacity: 1, y: 0 }}
                                                                    viewport={{ once: true, margin: "-50px" }}
                                                                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                                                >
                                                                    <div className="group relative">
                                                                        <div className="absolute -left-12 -top-8 text-zinc-800 opacity-0 md:group-hover:opacity-50 transition-opacity duration-700 pointer-events-none">
                                                                            <Quote className="w-20 h-20 fill-current transform scale-x-[-1]" />
                                                                        </div>

                                                                        <TestimonialCard
                                                                            data={testimonial}
                                                                            index={i}
                                                                        />
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    )
                                            }
                                        </div>

                                        {/* FOOTER CTA */}
                                        <div className="max-w-xl mx-auto text-center mt-32 pt-20 border-t border-white/5">
                                            <div className="inline-flex items-center gap-2 mb-6 opacity-50">
                                                <div className="w-5 h-5 rounded bg-zinc-800" />
                                                <span className="font-display font-bold text-sm">TestimonialHub</span>
                                            </div>
                                            <p className="text-zinc-500 text-sm mb-8">
                                                Ready to build your own reputation infrastructure?
                                            </p>
                                            <Button className="rounded-full px-8 bg-zinc-900 border-zinc-800 hover:border-zinc-700">
                                                Create your page
                                            </Button>
                                        </div>
                                    </>)
                            }

                        </div>
                    )
            }
        </div >
    );
};