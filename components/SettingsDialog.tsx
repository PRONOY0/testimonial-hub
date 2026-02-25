/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import axios from 'axios';
import { Loader } from './Loader';
import { IoIosWarning } from "react-icons/io";

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const [tagline, setTagline] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');
    const [usernameChanged, setUsernameChanged] = useState(false);

    useEffect(() => {
        if (isOpen && !fetching) {
            fetchSettings();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fetchSettings = async () => {
        setFetching(true);
        try {
            const res = await axios.get('/api/user');
            setTagline(res.data.user.tagLine || '');
            setCustomUrl(res.data.user.customUrl || '');
            setAvatarPreview(res.data.user.avatarUrl || '');
            setLocation(res.data.user.location || '');
            setName(res.data.user.name || '');
            setUsername(res.data.user.userName || '');
            setOriginalUsername(res.data.user.userName || '');

            console.log("Printing user")
            console.log(res);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setFetching(false);
        }
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

    const handleSave = async () => {
        setLoading(true);
        try {
            // Convert avatar to base64 if new file uploaded
            let avatarBase64: string | null = null;

            if (avatarFile) {
                avatarBase64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(avatarFile);
                });
            }

            const res = await axios.patch('/api/user', {
                name: name,
                userName: username,
                tagLine: tagline,
                customUrl: customUrl,
                avatarUrl: avatarBase64,
                location: location,
            });

            console.log('Saved:', res.data.user);

            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                setAvatarFile(null); // Reset file
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Failed to save:', error);
            alert(error.response?.data?.error || 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSaved(false);
        setLoading(false);
        setAvatarFile(null);
        setLocation('');
        setName('');
        setTagline('');
        setCustomUrl('');
        setOriginalUsername('');
        setUsername('');
        setUsernameChanged(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-6"
                    >
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-bold">Profile Settings</h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Loading State */}
                            {fetching ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Avatar Upload */}
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

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            maxLength={100}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                    </div>

                                    {/* userName */}
                                    <div>
                                        <label htmlFor='UserName' className="block text-sm font-medium text-zinc-400 mb-2">
                                            Username
                                        </label>
                                        <input
                                            id='UserName'
                                            type="text"
                                            value={username}
                                            onChange={(e) => {
                                                const newUsername = e.target.value;
                                                setUsername(newUsername);
                                                setUsernameChanged(newUsername !== originalUsername);
                                            }}
                                            placeholder="your username"
                                            maxLength={50}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                        {usernameChanged && (
                                            <div className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                                                <IoIosWarning className="inline mr-1 mb-0.5" />
                                                Changing your username will update your public profile URL.
                                            </div>
                                        )}
                                    </div>


                                    {/* Tagline */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            Tagline
                                        </label>
                                        <input
                                            type="text"
                                            value={tagline}
                                            onChange={(e) => setTagline(e.target.value)}
                                            placeholder="e.g., Full-Stack Developer crafting digital experiences"
                                            maxLength={100}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                        <div className="text-xs text-zinc-600 mt-1 text-right">
                                            {tagline.length}/100
                                        </div>
                                    </div>

                                    {/* Custom URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400">
                                            Portfolio / Website
                                        </label>
                                        <input
                                            type="url"
                                            value={customUrl}
                                            onChange={(e) => setCustomUrl(e.target.value)}
                                            placeholder="https://yourportfolio.com"
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                        <p className="text-xs text-zinc-600 mt-1">
                                            This will appear on your public profile
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="USA"
                                            maxLength={100}
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                    </div>

                                    {/* Save Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        disabled={loading}
                                        className={`w-full py-3 rounded-xl font-medium transition-all ${saved
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white text-black hover:bg-white/90'
                                            }`}
                                    >
                                        {
                                            loading ?
                                                (
                                                    <Loader />
                                                )
                                                :
                                                (
                                                    saved ? 'Saved!' : 'Save Changes'
                                                )
                                        }
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};