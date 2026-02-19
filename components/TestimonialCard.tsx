'use client';

import React, { useState, useRef } from 'react';
import { Star, ShieldCheck, Play, Pause, Linkedin, Instagram } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Testimonial } from '@/types/types';
import { BsTwitterX } from 'react-icons/bs';

interface Props {
  data: Testimonial;
  index: number;
}

export const TestimonialCard: React.FC<Props> = ({ data, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Determine icon based on URL
  const getSocialIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('linkedin')) return <Linkedin className="w-3.5 h-3.5" />;
    if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return <BsTwitterX className="w-3.5 h-3.5" />;
    if (lowerUrl.includes('instagram')) return <Instagram className="w-3.5 h-3.5" />;
    return <Linkedin className="w-3.5 h-3.5" />; // Default fallback
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  function getOrdinalDate(date: Date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    const suffix = ["th", "st", "nd", "rd"];
    const v = day % 100;
    const dayWithSuffix = day + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);

    return `${dayWithSuffix} ${month} ${year}`;
  }

  return (
    <Card delay={index * 0.1} className="hover:border-white/20 transition-all duration-500">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Avatar or Fallback */}
          <div className="w-14 h-14 rounded-full bg-zinc-800 overflow-hidden border border-white/5 flex items-center justify-center shrink-0">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-zinc-400">{getInitials(data.name)}</span>
            )}
          </div>

          <div className="flex flex-col">
            <h4 className="text-base font-medium text-white flex items-center gap-1.5">
              {data.name}
              {data.isVerifiedByOwner && (
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
              )}
            </h4>
            {data.company && (
              <div className="text-xs text-zinc-500">
                <span className="text-zinc-400">{data.company}</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Link (Clickable with correct icon) */}
        <a
          href={data.socialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-cyan-700 transition-all duration-300 border border-transparent hover:border-white/5"
          aria-label={`Visit ${data.name}'s profile`}
        >
          {getSocialIcon(data.socialLink)}
        </a>
      </div>

      {/* Content */}
      <p className="text-lg text-zinc-300 leading-relaxed mb-5 font-light">
        {data.feedback}
      </p>

      {/* Footer: Stars, Audio, Date */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < data.stars ? 'fill-neon-blue text-neon-blue' : 'text-zinc-800'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {data.audioUrl && (
            <>
              <button
                onClick={toggleAudio}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[10px] font-medium text-neon-blue cursor-pointer hover:bg-neon-blue/20 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </>
                )}
              </button>
              <audio
                ref={audioRef}
                src={data.audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </>
          )}
          <span className="text-sm text-zinc-500 font-mono uppercase tracking-wide">
            {getOrdinalDate(new Date(data.createdAt))}
          </span>
        </div>
      </div>
    </Card>
  );
};