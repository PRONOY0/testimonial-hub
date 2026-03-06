/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Star,
    ShieldCheck,
    Quote,
    Globe,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TestimonialCard } from '@/components/TestimonialCard';
import { CustomLink, Testimonial, unAuthorizedError } from '@/types/types';
import axios from 'axios';
import { BsTwitterX, BsInstagram, BsLinkedin, BsYoutube } from "react-icons/bs"
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
    const [location, setLocation] = useState('');
    const [socials, setSocials] = useState({
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
    })
    const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

    const getSocialIcon = (type: string) => {
        switch (type) {
            case 'instagram': return <BsInstagram className="w-5 h-5" />;
            case 'twitter': return <BsTwitterX className="w-5 h-5" />;
            case 'linkedin': return <BsLinkedin className="w-5 h-5" />;
            case 'youtube': return <BsYoutube className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    const getSocialUrl = (type: string, handle: string) => {
        switch (type) {
            case 'instagram': return `https://instagram.com/${handle}`;
            case 'twitter': return `https://twitter.com/${handle}`;
            case 'linkedin': return `https://linkedin.com/in/${handle}`;
            case 'youtube': return `https://youtube.com/@${handle}`;
            default: return '#';
        }
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get(getuser + `${username}`);

                setName(res.data.user.name);
                setTotalTestimonials(res.data.stats.totalTestimonials);
                setAvgRating(res.data.stats.avgRating);
                setAvatarUrl(res.data.user.avatarUrl);
                setVerifiedCount(res.data.stats.verifiedCount);
                setTagline(res.data.user.tagLine);
                setLocation(res.data.user.location);

                setTestimonials(res.data.testimonials || []);

                setSocials({
                    instagram: res.data.socials.instagram || '',
                    twitter: res.data.socials.twitter || '',
                    linkedin: res.data.socials.linkedin || '',
                    youtube: res.data.socials.youtube || '',
                })

                setCustomLinks(res.data.customLinks);

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
                        <div className="fixed inset-0 flex items-center justify-center">
                            <Loader size={40} />
                        </div>
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
                                            alt={name || "profile picture of user"}
                                            className="w-full h-full rounded-full object-cover grayscale-[0.2]"
                                        />
                                    </div>
                                    {/* Verified Badge on Avatar */}
                                    <div className="absolute bottom-2 right-2 bg-cyan-500 text-neon-blue p-1.5 rounded-full border-2 border-zinc-800 z-20 shadow-xl">
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

                                {/* Location & Socials */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="flex flex-col items-center gap-6 mb-10"
                                >
                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm text-zinc-500">
                                        <MapPin className="w-3.5 h-3.5" /> {location}
                                    </div>

                                    {/* Social Links & Custom Links Container */}
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        {/* Social Icons */}
                                        {['instagram', 'twitter', 'linkedin', 'youtube'].map((social) => {
                                            const handle = socials[social as keyof typeof socials];
                                            if (!handle) return null;

                                            return (
                                                <a
                                                    key={social}
                                                    href={getSocialUrl(social, handle)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 transition-all duration-300 group hover:border-neon-blue/40 hover:bg-neon-blue/5 hover:text-neon-blue hover:shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]"
                                                >
                                                    {getSocialIcon(social)}
                                                </a>
                                            );
                                        })}

                                        {/* Divider if both exist */}
                                        {(customLinks.length > 0 && ['instagram', 'twitter', 'linkedin', 'youtube'].some(s => socials[s as keyof typeof socials])) && (
                                            <div className="hidden md:block w-px h-8 bg-zinc-800 mx-2" />
                                        )}

                                        {/* Custom Links */}
                                        {customLinks.map((link) => (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 transition-all duration-300 group hover:border-neon-blue/40 hover:bg-neon-blue/5 hover:text-neon-blue hover:shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]"
                                            >
                                                <span className="text-sm font-medium">{link.label}</span>
                                                <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                            </a>
                                        ))}
                                    </div>
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

                            {/* TESTIMONIALS SECTION */}
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

                                <div className="space-y-8 md:space-y-12">
                                    {testimonials.map((testimonial, index) => (
                                        <motion.div
                                            key={testimonial.id}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <div className="group relative">
                                                {/* Quote mark decoration */}
                                                <div className="absolute -left-12 -top-8 text-zinc-800 opacity-0 md:group-hover:opacity-50 transition-opacity duration-700 pointer-events-none">
                                                    <Quote className="w-20 h-20 fill-current transform scale-x-[-1]" />
                                                </div>

                                                <TestimonialCard
                                                    data={testimonial}
                                                    key={testimonial.id}
                                                    index={index}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
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

                        </div>
                    )
            }
        </div>
    );
};