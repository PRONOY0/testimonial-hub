import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Layout, Code, Mic, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TestimonialCard } from '../components/TestimonialCard';
import Link from 'next/link';
import { Testimonial } from '@/types/types';

const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    company: 'Stripe',
    avatarUrl: 'https://picsum.photos/seed/sarah/100/100',
    stars: 5,
    feedback: "The level of polish in Alex's work is unmatched. Not only did they deliver ahead of schedule, but the attention to micro-interactions blew our team away.",
    isVerifiedByOwner: true,
    createdAt: '2023-10-27T14:22:01Z',
    socialLink: 'https://linkedin.com/in/sarahjenkins',
    audioUrl: 'https://example.com/audio1.mp3'
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Vercel',
    avatarUrl: 'https://picsum.photos/seed/michael/100/100',
    stars: 5,
    feedback: "Easily the best freelance developer I've hired in the last 5 years. Communication was pristine.",
    isVerifiedByOwner: true,
    createdAt: '2023-10-20T14:22:01Z',
    socialLink: 'https://twitter.com/mchen'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    company: 'Linear',
    avatarUrl: 'https://picsum.photos/seed/elena/100/100',
    stars: 4,
    feedback: "Incredible technical skills. Solved complex architecture problems we had been struggling with for months.",
    isVerifiedByOwner: false,
    createdAt: '2023-05-15T14:22:01Z',
    socialLink: 'https://linkedin.com/in/elenarodriguez'
  }
];

export const Hero: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="relative px-6 mb-32">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-blue mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
              </span>
              v1.0
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Reputation infrastructure <br />
              <span className="text-zinc-500">for the top 1%.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Collecting testimonials shouldn&apos;t feel like begging.
              TestimonialHub provides a <span className="text-white">premium architecture</span> for capturing and showcasing your professional value.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button className="pl-8 pr-6">
                  Get your link <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50" />
      </section>

      {/* Editorial Bento Section */}
      <section className="px-6 mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl md:text-6xl font-bold"
            >
              The complete <br />
              <span className="text-zinc-500">reputation stack.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[180px]">

            {/* 1. Shareable Link (Primary - Large) */}
            <Card className="md:col-span-8 md:row-span-2 flex flex-col justify-between group overflow-hidden relative border-white/5">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center mb-6 border border-white/5 group-hover:border-neon-blue/20 transition-colors">
                  <LinkIcon className="w-5 h-5 text-neon-blue" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">One link. Zero friction.</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                  Forget the back-and-forth. Send your unique handle to clients, and they can submit text or audio reviews in seconds. No login required.
                </p>
              </div>

              {/* Visual: Abstract URL Bar */}
              <div className="mt-8 w-full bg-zinc-900/80 rounded-lg border border-white/5 p-3 flex items-center gap-3 backdrop-blur-sm transform group-hover:translate-y-1 transition-transform duration-500 shadow-xl">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
                <div className="h-8 flex-1 bg-black/40 rounded flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <span className="text-xs font-mono text-zinc-500">testimonialhub.io/</span>
                  <span className="text-xs font-mono text-zinc-300">your-name</span>
                </div>
              </div>

              {/* Subtle Gradient Hover */}
              <div className="absolute inset-0 bg-linear-to-br from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </Card>

            {/* 2. Audio Testimonials (Medium) */}
            <Card delay={0.1} className="md:col-span-4 md:row-span-1 bg-zinc-900/30 group relative overflow-hidden">
              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-white/5">
                    <Mic className="w-4 h-4 text-neon-purple" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-1">Audio & Voice</h3>
                  <p className="text-xs text-zinc-500">Capture tone and nuance with high-fidelity voice messages.</p>
                </div>
              </div>
              {/* Visual: Waveform hint */}
              <div className="absolute top-6 right-6 flex gap-0.5 items-center opacity-50 group-hover:opacity-100 transition-opacity">
                {[4, 10, 6, 14, 8, 12, 5, 8, 3].map((h, i) => (
                  <div key={i} className="w-1 bg-neon-purple/40 rounded-full" style={{ height: h * 1.5 }} />
                ))}
              </div>
            </Card>

            {/* 3. Verified Identity (Medium) */}
            <Card delay={0.2} className="md:col-span-4 md:row-span-1 group overflow-hidden">
              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-white/5">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-1 flex items-center gap-2">
                    Verified Identity
                    <CheckCircle2 className="w-3 h-3 text-neon-blue" />
                  </h3>
                  <p className="text-xs text-zinc-500">LinkedIn & work email validation for instant trust.</p>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
            </Card>

            {/* 4. Beautiful Pages (Wide) */}
            <Card delay={0.3} className="md:col-span-7 md:row-span-1 flex items-center justify-between group relative overflow-hidden">
              <div className="relative z-10 pr-6">
                <h3 className="font-display text-xl font-bold mb-2">Gallery-grade presentation</h3>
                <p className="text-sm text-zinc-400">Your public page is auto-generated and designed to persuade.</p>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-110 transition-transform duration-500">
                <Layout className="w-5 h-5 text-zinc-300" />
              </div>
              <div className="absolute inset-0 bg-linear-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>

            {/* 5. Embedding (Small/Medium) */}
            <Card delay={0.4} className="md:col-span-5 md:row-span-1 group">
              <div className="h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-white/5">
                    <Code className="w-4 h-4 text-zinc-300" />
                  </div>
                  <h3 className="font-display text-lg font-bold">Embed Anywhere</h3>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400 border border-white/5 group-hover:border-white/10 transition-colors">React</span>
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400 border border-white/5 group-hover:border-white/10 transition-colors">Webflow</span>
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400 border border-white/5 group-hover:border-white/10 transition-colors">Framer</span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 mb-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-16 text-center">Engineered for quality.</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: "Claim Link", desc: "Reserve your unique handle." },
              { step: "02", title: "Share", desc: "Send to clients after delivery." },
              { step: "03", title: "Showcase", desc: "Embed anywhere with one line." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-display font-bold text-white/5 mb-4 group-hover:text-white/10 transition-colors duration-500">{item.step}</div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-base text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Preview */}
      <section className="px-6 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-3xl font-bold">Recent activity</h2>
            <div className="text-zinc-500 text-sm font-mono">Live updates</div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="grid md:grid-cols-3 gap-6"
          >
            {DEMO_TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.id} data={t} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};