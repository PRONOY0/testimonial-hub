"use client";
import { motion } from 'framer-motion';
import { Users, Award, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Testimonial, unAuthorizedError } from '@/types/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchUserTestimonial, websiteUrl } from '@/lib/api';
import { CopyLink } from '@/components/CopyLink';
import LottieAnimation from '@/components/LottieAnimation';
import { Loader } from '@/components/Loader';
import { AuthCard } from '@/components/AuthCard';

export default function Dashboard() {

  const [userName, setUserName] = useState(null);
  const [name, setName] = useState(null);
  const [totalTestimonials, setTotalTestimonials] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, SetStatus] = useState('');

  useEffect(() => {
    async function getTestimonials() {
      try {
        const res = await axios.get(`${fetchUserTestimonial}`)
        console.log(res?.data);
        setUserName(res.data.user.userName);
        setName(res.data.user.name);
        setTotalTestimonials(res.data.stats.totalTestimonials);
        setAvgRating(res.data.stats.avgRating);
        setAvatarUrl(res.data.user.avatarUrl);
        setVerifiedCount(res.data.stats.verifiedCount);

        setTestimonials(res.data.testimonials || []);

        setLoading(false);
      } catch (error) {
        const err = error as unAuthorizedError;
        console.log(err.status);
        if (err.status === 401) {
          SetStatus('unauthorized');
          setLoading(false);
        }
      }
    }

    getTestimonials()
  }, []);

  if (status === 'unauthorized') {
    return <AuthCard />
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {
        loading ?
          (
            <div className="fixed inset-0 flex items-center justify-center">
              <Loader size={40} />
            </div>
          )
          :
          (
            <div className="max-w-5xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-16"
              >
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 bg-zinc-800 p-1 border border-white/10">
                  <img src={avatarUrl || `https://api.dicebear.com/9.x/lorelei/svg?seed=${userName}`} loading='lazy' alt="Profile" className='rounded-xl' />
                </div>

                <h1 className="font-display text-4xl font-bold mb-2">Welcome back, {name}</h1>

                <p className="text-zinc-500">
                  Your reputation is trending upward this week.
                </p>

              </motion.div>

              <div className="mb-20">
                <CopyLink
                  submissionLink={`${websiteUrl}/${userName}`}
                  publicLink={`${websiteUrl}/profile/${userName}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                {[
                  { label: 'Total Testimonials', value: totalTestimonials, icon: Users, delay: 0 },
                  { label: 'Average Rating', value: avgRating, icon: Star, delay: 0.1 },
                  { label: 'Verified Reviews', value: verifiedCount, icon: Award, delay: 0.2 },
                ].map((stat, i) => (
                  <Card key={i} delay={stat.delay} className="flex items-center gap-4 py-8">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                      <stat.icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-display font-bold">{stat.value}</div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display text-xl font-bold">Latest Feedback</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs rounded-full bg-white/10 text-white cursor-none" data-hover="true">
                      All
                    </button>

                    {/* //! Commenting it out only for future use */}
                    {/* <button className="px-3 py-1 text-xs rounded-full text-zinc-500 hover:text-white transition-colors" data-hover="true">
                      Verified Only
                    </button> */}
                  </div>
                </div>
                <div className="space-y-4">
                  {testimonials.map((testimonial, i) => (
                    <TestimonialCard key={testimonial.id} data={testimonial} index={i} />
                  ))}
                </div>
              </div>

              {!loading && testimonials.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <LottieAnimation
                    animationPath="/emptyGhost.json"
                    className="w-96 h-96 mb-6"
                  />

                  <h2 className="text-5xl font-bold text-gray-200 mb-2">
                    Your First Testimonial Awaits
                  </h2>

                  <p className="text-zinc-500 text-center max-w-md mb-8">
                    Share your unique link with clients and start building credibility.
                    Every expert started with zero testimonials.
                  </p>
                </div>
              )}
            </div>
          )
      }
    </div>
  );
};