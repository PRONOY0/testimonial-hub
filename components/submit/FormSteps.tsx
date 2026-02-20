'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Mic, Image as ImageIcon, Linkedin, Instagram,
  Check, Upload, Play, Square, RotateCcw, Pause, Trash2, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { StepProps } from './types';
import Link from 'next/link';
import { TestimonialCard } from '@/components/TestimonialCard';
import { BsTwitterX } from 'react-icons/bs';

export const shakeVariant = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};

export const IntroStep: React.FC<{ username?: string, onNext: () => void }> = ({ username, onNext }) => (
  <div className="text-center max-w-xl mx-auto flex flex-col items-center">
    {/* <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-24 h-24 rounded-full bg-linear-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 mx-auto mb-10 flex items-center justify-center relative"
    >
      <div className="absolute inset-0 rounded-full bg-neon-blue/10 blur-xl animate-pulse-slow" />
      <Sparkles className="w-10 h-10 text-white relative z-10" />
    </motion.div> */}

    <h1 className="font-display text-4xl md:text-6xl font-bold mb-8 leading-tight">
      <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-purple capitalize">How was working with {""} {username || 'Alex'}</span> ?
    </h1>

    <p className="text-lg sm:text-xl text-zinc-400 mb-12 leading-relaxed max-w-md mx-auto">
      I’d love to hear what it was like for<br />you whatever you felt, truly.
    </p>

    <Button onClick={onNext} className="h-14 text-lg shadow-[0_0_30px_rgba(34,211,238,0.15)] py-2">
      Share your thoughts
    </Button>
  </div>
);

export const IdentityStep: React.FC<StepProps> = ({ formData, updateField, errors }) => {
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('avatar', file);
        updateField('avatarPreview', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-10">
      <motion.div variants={shakeVariant} animate={errors.name ? "shake" : ""}>
        <label className="block font-display text-2xl font-bold mb-4">What&apos;s your name?</label>
        <input
          autoFocus
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Jane Doe"
          className={cn(
            "w-full bg-transparent border-b-2 text-3xl py-4 focus:outline-none transition-colors font-light",
            errors.name
              ? "border-red-500/50 text-red-500 placeholder-red-500/30"
              : "border-zinc-800 focus:border-neon-blue text-white placeholder-zinc-700"
          )}
        />
        {errors.name && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.name}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={shakeVariant} animate={errors.company ? "shake" : ""}>
        <div className="flex justify-between items-baseline mb-4">
          <label className="block font-display text-xl font-bold text-zinc-400">Company or Project</label>
          <span className="text-xs text-zinc-600 uppercase tracking-wide">Optional</span>
        </div>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder="Acme Inc."
          className={cn(
            "w-full bg-transparent border-b-2 text-2xl py-3 focus:outline-none transition-colors font-light",
            errors.company
              ? "border-red-500/50 text-red-500 placeholder-red-500/30"
              : "border-zinc-800 focus:border-neon-blue text-white placeholder-zinc-700"
          )}
        />
      </motion.div>

      <div className="pt-4">
        <label className="block text-sm text-zinc-500 mb-4 uppercase tracking-wider font-medium">Profile Photo (Optional)</label>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center overflow-hidden relative group hover:border-zinc-500 transition-colors cursor-pointer">
            {formData.avatarPreview ? (
              <img src={formData.avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div className="text-sm text-zinc-500">
            <p>Makes it more personal.</p>
            <p className="text-xs text-zinc-600 mt-1">Supports JPG, PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StoryStep: React.FC<StepProps> = ({ formData, updateField, errors }) => (
  <div className="max-w-2xl mx-auto h-full flex flex-col">
    <label className="block font-display text-3xl font-bold mb-6">What stood out most?</label>
    <p className="text-zinc-500 mb-8 max-w-lg">
      Did they solve a specific problem? How was the communication? What results did you see?
    </p>

    <motion.div
      className="relative flex-1 min-h-75"
      variants={shakeVariant}
      animate={errors.feedback ? "shake" : ""}
    >
      <textarea
        autoFocus
        value={formData.feedback}
        onChange={(e) => updateField('feedback', e.target.value)}
        placeholder="Start typing your experience..."
        className={cn(
          "w-full h-full bg-zinc-900/30 rounded-2xl p-6 text-xl md:text-2xl leading-relaxed resize-none focus:outline-none transition-colors font-light border-2",
          errors.feedback
            ? "border-red-500/20 text-white placeholder-red-500/30"
            : "border-transparent focus:border-neon-blue/20 text-white placeholder-zinc-800"
        )}
        style={{ scrollbarWidth: 'none' }}
      />
      {errors.feedback && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 left-0 text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {errors.feedback}
        </motion.div>
      )}
      <div className={cn(
        "absolute bottom-6 right-6 text-sm font-mono transition-colors",
        formData.feedback.length > 0 ? "text-zinc-500" : "text-zinc-700"
      )}>
        {formData.feedback.length} chars
      </div>
    </motion.div>
  </div>
);

export const RatingStep: React.FC<StepProps> = ({ formData, updateField, errors }) => (
  <div className="max-w-xl mx-auto text-center">
    <h2 className="font-display text-3xl font-bold mb-12">How would you rate the experience?</h2>

    <motion.div
      variants={shakeVariant}
      animate={errors.rating ? "shake" : ""}
      className="flex items-center justify-center gap-4"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => updateField('rating', star)}
          className="focus:outline-none group p-2"
        >
          <Star
            className={cn(
              "w-12 h-12 md:w-16 md:h-16 transition-all duration-300",
              star <= formData.rating
                ? "fill-neon-blue text-neon-blue drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                : "text-zinc-800 group-hover:text-zinc-700 stroke-[1.5px]"
            )}
          />
        </motion.button>
      ))}
    </motion.div>

    <div className="min-h-12 mt-12 flex flex-col items-center justify-center">
      {formData.rating > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={formData.rating}
          className="text-neon-blue font-medium text-xl"
        >
          {formData.rating === 5 && "Absolutely amazing!"}
          {formData.rating === 4 && "Great experience."}
          {formData.rating === 3 && "It was okay."}
          {formData.rating > 0 && formData.rating < 3 && "Could be better."}
        </motion.div>
      ) : (
        errors.rating && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Please select a rating to continue
          </motion.p>
        )
      )}
    </div>
  </div>
);

export const MediaStep: React.FC<StepProps> = ({ formData, updateField, onNext }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        updateField('audioBlob', audioBlob);
        updateField('audioUrl', audioUrl);
        updateField('audioFile', null);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const deleteRecording = () => {
    updateField('audioBlob', null);
    updateField('audioUrl', null);
    updateField('audioFile', null);
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (!formData.audioUrl) return;

    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(formData.audioUrl);
        audioPlayerRef.current.onended = () => setIsPlaying(false);
      }
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      deleteRecording();
      updateField('audioFile', file);
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
        <Mic className="w-8 h-8 text-neon-purple" />
      </div>
      <h2 className="font-display text-3xl font-bold mb-4">Voice Note</h2>
      <p className="text-zinc-400 mb-10">
        Record a quick audio message. It&apos;s faster and adds personal touch.
      </p>

      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 mb-8 relative overflow-hidden backdrop-blur-sm">
        {!isRecording && !formData.audioUrl && !formData.audioFile && (
          <div className="flex flex-col items-center gap-6">
            <Button
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center transition-all shadow-[0_0_30px_rgba(68,227,239,0.3)] hover:scale-105 group"
            >
              <Mic className="w-8 h-8 text-white group-hover:animate-pulse" />
            </Button>
            <div className="text-sm text-zinc-500">Tap to record</div>
            <div className="w-full flex items-center gap-4 my-4">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-xs text-zinc-600 uppercase">Or upload file</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>
            <label className="cursor-pointer px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Choose Audio File</span>
              <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {isRecording && (
          <div className="flex flex-col items-center gap-6">
            <div className="font-mono text-3xl text-white tabular-nums tracking-widest">
              {formatTime(recordingTime)}
            </div>
            <div className="flex items-center gap-1 h-12">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-cyan-500 rounded-full"
                  animate={{ height: [10, 32, 10] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                />
              ))}
            </div>
            <button
              onClick={stopRecording}
              className="px-6 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-white/10 flex items-center gap-2 text-white transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Recording</span>
            </button>
          </div>
        )}

        {(formData.audioUrl || formData.audioFile) && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full bg-zinc-800/50 rounded-xl p-4 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayback}
                  className="w-10 h-10 rounded-full bg-neon-blue flex items-center justify-center text-black hover:bg-neon-blue/90 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-white">
                    {formData.audioFile ? formData.audioFile.name : 'Voice Message'}
                  </span>
                  <span className="text-xs text-zinc-500">Audio ready</span>
                </div>
              </div>
              <button
                onClick={deleteRecording}
                className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={deleteRecording}
              className="text-sm text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Record again
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <button onClick={onNext} className="text-zinc-500 hover:text-white text-sm transition-colors underline decoration-zinc-800 underline-offset-4">
          {formData.audioUrl || formData.audioFile ? 'Continue with audio' : 'Skip this step'}
        </button>
      </div>
    </div>
  );
};

export const VerificationStep: React.FC<StepProps> = ({ formData, updateField, errors }) => (
  <div className="max-w-xl mx-auto">
    <h2 className="font-display text-3xl font-bold mb-4">One last thing.</h2>
    <p className="text-zinc-400 mb-10">
      Where can people verify your profile? This adds credibility to your review.
    </p>

    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {['linkedin', 'twitter', 'instagram'].map((type) => (
          <button
            key={type}
            onClick={() => updateField('socialType', type)}
            className={cn(
              "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300",
              formData.socialType === type
                ? "bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:border-zinc-700"
            )}
          >
            {type === 'linkedin' && <Linkedin className="w-6 h-6" />}
            {type === 'twitter' && <BsTwitterX className="w-6 h-6" />}
            {type === 'instagram' && <Instagram className="w-6 h-6" />}
            <span className="capitalize text-sm font-medium">{type}</span>
          </button>
        ))}
      </div>

      <motion.div variants={shakeVariant} animate={errors.socialLink ? "shake" : ""}>
        <label className="block text-sm text-zinc-500 mb-2 uppercase tracking-wider font-medium">Profile URL</label>
        <div className="relative">
          <input
            type="url"
            value={formData.socialLink}
            onChange={(e) => updateField('socialLink', e.target.value)}
            placeholder={`https://${formData.socialType === 'twitter' ? 'twitter' : formData.socialType}.com/${formData.socialType === 'linkedin' ? 'in/' : ''}username`}
            className={cn(
              "w-full bg-zinc-900/50 border rounded-xl px-4 py-4 focus:outline-none focus:ring-1 transition-all text-white placeholder-zinc-700 font-mono text-sm pl-12",
              errors.socialLink
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                : "border-zinc-800 focus:border-neon-blue focus:ring-neon-blue/50"
            )}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {formData.socialType === 'linkedin' && <Linkedin className="w-5 h-5" />}
            {formData.socialType === 'twitter' && <BsTwitterX className="w-4 h-4" />}
            {formData.socialType === 'instagram' && <Instagram className="w-5 h-5" />}
          </div>
          {!errors.socialLink && formData.socialLink.length > 10 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500/20 text-green-500 p-1 rounded-full"
            >
              <Check className="w-3 h-3" />
            </motion.div>
          )}
        </div>
        {errors.socialLink && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-2 ml-1">
            {errors.socialLink}
          </motion.p>
        )}
      </motion.div>
    </div>
  </div>
);

export const ReviewStep: React.FC<StepProps> = ({ formData, onNext, isSubmitting }) => (
  <div className="w-full">
    <h2 className="font-display text-4xl font-bold mb-4 text-center">
      This is what they&apos;ll see
    </h2>
    <p className="text-zinc-500 text-center mb-10 text-lg">
      If everything looks good, go ahead and submit.
    </p>

    {/* Bigger testimonial card */}
    <div className="mb-10 max-w-2xl mx-auto">
      <div className='scale-110'>
        <TestimonialCard
          data={{
            id: 'preview',
            name: formData.name,
            company: formData.company || '',
            avatarUrl: formData.avatarPreview || '',
            stars: formData.rating,
            feedback: formData.feedback,
            isVerifiedByOwner: true,
            createdAt: new Date().toLocaleString(),
            socialLink: formData.socialLink,
            audioUrl: formData.audioUrl || (formData.audioFile ? URL.createObjectURL(formData.audioFile) : '')
          }}
          index={0}
        />
      </div>
    </div>

    <div className="flex justify-center">
      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="h-14 px-12 text-lg"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </div>
        ) : (
          "Submit Testimonial"
        )}
      </Button>
    </div>
  </div>
);

export const SuccessStep: React.FC<{ username?: string }> = ({ username }) => (
  <div className="text-center max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
    {/* Success checkmark animation */}
    <div className="relative mb-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-linear-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border-2 border-green-500/50 text-green-500 z-10 relative shadow-[0_0_50px_rgba(34,197,94,0.3)]"
      >
        <Check className="w-12 h-12" strokeWidth={3} />
      </motion.div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute inset-0 bg-green-500/30 rounded-full blur-xl"
      />
    </div>

    {/* Success message */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="font-display text-4xl md:text-5xl font-bold mb-4"
    >
      Thank you!
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-2xl text-zinc-500 mb-6"
    >
      This means a lot.
    </motion.p>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-lg text-zinc-400 mb-12 max-w-md"
    >
      Your testimonial has been successfully sent to <span className="text-white font-medium">{username || 'Alex'}</span>.
    </motion.p>

    {/* Back to home button */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <Link href="/">
        <Button className="px-8 h-12 rounded-full py-2">Back to Home</Button>
      </Link>
    </motion.div>
  </div>
);