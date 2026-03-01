/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { showToast } from "nextjs-toast-notify"
import {
    Camera,
    AlertTriangle,
    Plus,
    Trash2,
    Save,
    MapPin,
    Globe,
    Link as LinkIcon
} from 'lucide-react';
import { BsTwitterX, BsYoutube, BsLinkedin, BsInstagram } from "react-icons/bs"
import axios from 'axios';
import { websiteUrl } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { CustomLink } from '@/types/types';

export default function Settings() {
    const [usernameWarning, setUsernameWarning] = useState(false);
    const [tagline, setTagline] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');
    const [socials, SetSocials] = useState({
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: '',
    })
    const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('/api/user');
                setTagline(res.data.user.tagLine || '');
                setCustomUrl(res.data.user.customUrl || '');
                setAvatarPreview(res.data.user.avatarUrl || '');
                setLocation(res.data.user.location || '');
                setName(res.data.user.name || '');
                setUsername(res.data.user.userName || '');
                setOriginalUsername(res.data.user.userName || '');
                SetSocials({
                    instagram: res.data.user.instagram || '',
                    twitter: res.data.user.twitter || '',
                    youtube: res.data.user.youtube || '',
                    linkedin: res.data.user.linkedin || '',
                })
                setCustomLinks(res.data.user.customLinks || []);


                console.log("Printing user data:");
                console.log(res);

            } catch (error) {
                console.log(`Error:${error}`)
            }
        }

        fetchSettings();
    }, []);

    const addCustomLink = () => {
        const newLink: CustomLink = {
            id: `temp-${Date.now()}`, // Temporary ID (will be replaced by DB ID)
            label: '',
            url: '',
            order: customLinks.length
        };
        setCustomLinks([...customLinks, newLink]);
    };

    const updateCustomLink = (id: string, field: 'label' | 'url', value: string) => {
        setCustomLinks(prev =>
            prev.map(link =>
                link.id === id ? { ...link, [field]: value } : link
            )
        );
    };

    const removeCustomLink = (id: string) => {
        setCustomLinks(prev => prev.filter(link => link.id !== id));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSocialChange = (platform: string, value: string) => {
        SetSocials(prev => ({
            ...prev,
            [platform]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            let avatarBase64: string | null = null;

            if (avatarFile) {
                avatarBase64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(avatarFile);
                });
            }

            await axios.patch('/api/user', {
                name: name,
                userName: username,
                tagLine: tagline,
                customUrl: customUrl,
                avatarUrl: avatarBase64,
                location: location,
                socials: {
                    instagram: socials.instagram,
                    twitter: socials.twitter,
                    youtube: socials.youtube,
                    linkedin: socials.linkedin,
                },
                links: customLinks
            });

            setSaved(true);
            setTimeout(() => {
                showToast.success("Updated Successfully", {
                    duration: 3000,
                    progress: true,
                    position: "bottom-right",
                    transition: "popUp",
                    sound: true,
                })
                setSaved(false);
                setAvatarFile(null);
            }, 1500);
        } catch (error: any) {
            console.error('Failed to save:', error);
            showToast.error(error.response?.data?.error || 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white pt-40 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <h1 className="text-4xl font-display font-medium tracking-tight">Settings</h1>
                    <p className="text-zinc-400">Manage your profile and public presence.</p>
                </motion.div>

                {/* Profile Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-4 border-b border-zinc-900 pb-2">
                        <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Identity</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <label className="block text-sm font-medium text-zinc-400 mb-3">
                                Profile Picture
                            </label>
                            <div className="relative group cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer block"
                                >
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 hover:border-white/30 transition-all relative">
                                        <img
                                            src={avatarPreview || `https://api.dicebear.com/9.x/lorelei/svg?seed=default`}
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <p className="text-xs text-zinc-600 mt-2">
                                Click to upload new picture
                            </p>
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 w-full space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-500 uppercase">Display Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-500 uppercase">Location (Country)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-600"
                                            placeholder="e.g. United States"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-zinc-500 uppercase">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{websiteUrl}/profile/</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                            setUsernameWarning(true);
                                        }}
                                        className={`w-full bg-zinc-900/50 border rounded-lg pl-80 pr-4 py-3 text-sm outline-none transition-all text-white placeholder:text-zinc-600 ${usernameWarning ? 'border-amber-500/50 focus:border-amber-500 focus:ring-amber-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                                    />
                                </div>

                                <AnimatePresence>
                                    {usernameWarning && originalUsername !== username && (
                                        <motion.div
                                            initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                                            animate={{
                                                opacity: 1,
                                                scaleY: 1,
                                                transition: {
                                                    duration: 0.25,
                                                    ease: [0.22, 1, 0.36, 1]
                                                }
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scaleY: 0,
                                                transition: {
                                                    duration: 0.2,
                                                    ease: "easeIn",
                                                }
                                            }}
                                            className="overflow-hidden origin-top"
                                        >
                                            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
                                                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                                                <p>
                                                    Changing your username will break existing links to your profile.
                                                    You will need to update them manually.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Socials Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-4 border-b border-zinc-900 pb-2">
                        <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Social Presence</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { id: 'instagram', icon: BsInstagram, label: 'Instagram', placeholder: 'username' },
                            { id: 'twitter', icon: BsTwitterX, label: '(Twitter)', placeholder: 'handle' },
                            { id: 'youtube', icon: BsYoutube, label: 'YouTube', placeholder: 'channel' },
                            { id: 'linkedin', icon: BsLinkedin, label: 'LinkedIn', placeholder: 'profile-id' },
                        ].map((social) => (
                            <div key={social.id} className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-mono text-zinc-500 uppercase">
                                    <social.icon className="text-xl hover:text-cyan-500 duration-300 transition-colors" /> {social.label}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">@</span>
                                    <input
                                        type="text"
                                        value={socials[social.id as keyof typeof socials] || ''}
                                        onChange={(e) => handleSocialChange(social.id, e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-8 pr-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-700"
                                        placeholder={social.placeholder}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Custom Links Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                        <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Custom Links</h2>
                        <button
                            onClick={addCustomLink}
                            className="text-xs flex items-center gap-1 text-neon-blue hover:text-white transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add Link
                        </button>
                    </div>

                    <div className="space-y-4">
                        {customLinks.map((link) => (
                            <motion.div
                                key={link.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-4 group"
                            >
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={link.label}
                                            onChange={(e) => updateCustomLink(link.id, 'label', e.target.value)}
                                            placeholder="Label (e.g. Behance)"
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-700"
                                        />
                                    </div>
                                    <div className="md:col-span-2 relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-700 font-mono"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeCustomLink(link.id)}
                                    className="p-3 rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}

                        {customLinks.length === 0 && (
                            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm">
                                No custom links added yet.
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Action Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-end pt-8 border-t border-zinc-900"
                >
                    <Button onClick={handleSave} disabled={loading}>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                    </Button>
                </motion.div>

            </div>
        </div>
    );
};
